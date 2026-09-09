const http = require("http");
const url = require("url");
const PORT = 3000;

// ---------------- In-memory data ----------------
let todos = [
  { id: 1, task: "Learn REST API", completed: false, priority: "high", dueDate: "", createdAt: new Date().toISOString() },
  { id: 2, task: "Build Todo Dashboard", completed: true, priority: "medium", dueDate: "", createdAt: new Date().toISOString() }
];
let nextId = 3;

// ---------------- Helpers ----------------
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const VALID_PRIORITIES = ["high", "medium", "low"];

// ---------------- API Handlers ----------------
async function handleAPI(req, res, pathname, query) {
  // GET /api/todos  (supports ?search= & ?filter=all|completed|pending & ?priority=)
  if (pathname === "/api/todos" && req.method === "GET") {
    let result = [...todos];

    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter((t) => t.task.toLowerCase().includes(s));
    }

    if (query.filter === "completed") {
      result = result.filter((t) => t.completed);
    } else if (query.filter === "pending") {
      result = result.filter((t) => !t.completed);
    }

    if (query.priority && query.priority !== "all") {
      result = result.filter((t) => t.priority === query.priority);
    }

    // Sort: incomplete first, then by priority (high>medium>low), then by due date
    result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pDiff !== 0) return pDiff;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

    return sendJSON(res, 200, result);
  }

  if (pathname === "/api/todos/summary" && req.method === "GET") {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;
    return sendJSON(res, 200, { total, completed, pending, overdue });
  }

  const idMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
  if (idMatch && req.method === "GET") {
    const todo = todos.find((t) => t.id === parseInt(idMatch[1]));
    if (!todo) return sendJSON(res, 404, { message: "Todo not found" });
    return sendJSON(res, 200, todo);
  }

  // POST /api/todos
  if (pathname === "/api/todos" && req.method === "POST") {
    try {
      const body = await getRequestBody(req);
      if (!body.task || !body.task.trim()) {
        return sendJSON(res, 400, { message: "Task is required" });
      }
      const priority = VALID_PRIORITIES.includes(body.priority) ? body.priority : "medium";
      const newTodo = {
        id: nextId++,
        task: body.task.trim(),
        completed: false,
        priority,
        dueDate: body.dueDate || "",
        createdAt: new Date().toISOString()
      };
      todos.push(newTodo);
      return sendJSON(res, 201, newTodo);
    } catch (err) {
      return sendJSON(res, 400, { message: "Invalid JSON body" });
    }
  }

  // PUT /api/todos/:id
  if (idMatch && req.method === "PUT") {
    try {
      const body = await getRequestBody(req);
      const todo = todos.find((t) => t.id === parseInt(idMatch[1]));
      if (!todo) return sendJSON(res, 404, { message: "Todo not found" });
      if (body.task !== undefined) {
        if (!body.task.trim()) return sendJSON(res, 400, { message: "Task cannot be empty" });
        todo.task = body.task.trim();
      }
      if (body.completed !== undefined) {
        todo.completed = Boolean(body.completed);
      }
      if (body.priority !== undefined && VALID_PRIORITIES.includes(body.priority)) {
        todo.priority = body.priority;
      }
      if (body.dueDate !== undefined) {
        todo.dueDate = body.dueDate;
      }
      return sendJSON(res, 200, todo);
    } catch (err) {
      return sendJSON(res, 400, { message: "Invalid JSON body" });
    }
  }

  const toggleMatch = pathname.match(/^\/api\/todos\/(\d+)\/toggle$/);
  if (toggleMatch && req.method === "PATCH") {
    const todo = todos.find((t) => t.id === parseInt(toggleMatch[1]));
    if (!todo) return sendJSON(res, 404, { message: "Todo not found" });
    todo.completed = !todo.completed;
    return sendJSON(res, 200, todo);
  }

  if (idMatch && req.method === "DELETE") {
    const exists = todos.some((t) => t.id === parseInt(idMatch[1]));
    if (!exists) return sendJSON(res, 404, { message: "Todo not found" });
    todos = todos.filter((t) => t.id !== parseInt(idMatch[1]));
    return sendJSON(res, 200, { message: "Todo Deleted Successfully" });
  }

  return sendJSON(res, 404, { message: "API route not found" });
}

// ---------------- Frontend (Dashboard) ----------------
const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Todo Dashboard</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter', 'Segoe UI', Arial, sans-serif; }
  body {
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%);
    min-height: 100vh;
    color:#1e1b2e;
    padding:32px 20px;
  }
  .container { max-width:820px; margin:0 auto; }

  .header { text-align:center; margin-bottom:28px; }
  .header h1 { font-size:32px; font-weight:800; background:linear-gradient(90deg,#6366f1,#a855f7);
               -webkit-background-clip:text; background-clip:text; color:transparent; margin-bottom:4px; }
  .header p { color:#71717a; font-size:14px; }

  .summary { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
  .card { background:#fff; border-radius:16px; padding:18px 12px; text-align:center;
          box-shadow:0 4px 14px rgba(99,102,241,0.08); border:1px solid #ede9fe; }
  .card h2 { font-size:26px; margin-bottom:2px; font-weight:800; }
  .card p { color:#8b8b99; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.3px; }
  .card.total h2 { color:#6366f1; }
  .card.completed h2 { color:#16a34a; }
  .card.pending h2 { color:#f59e0b; }
  .card.overdue h2 { color:#ef4444; }

  .panel { background:#fff; border-radius:18px; padding:22px; margin-bottom:22px;
           box-shadow:0 4px 20px rgba(99,102,241,0.07); border:1px solid #ede9fe; }
  .panel h3 { font-size:15px; font-weight:700; margin-bottom:14px; color:#3f3f52; }

  .form-row { display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
  input[type="text"], input[type="date"], select {
    padding:12px 14px; border-radius:10px; border:1.5px solid #e4e4ee; font-size:14px;
    background:#faf9ff; outline:none; transition:border-color .15s;
  }
  input[type="text"]:focus, input[type="date"]:focus, select:focus { border-color:#a5b4fc; background:#fff; }
  input[type="text"]#newTask { flex:2; min-width:200px; }
  select#prioritySelectAdd { flex:1; min-width:120px; }
  input[type="date"]#dueDateAdd { flex:1; min-width:150px; }

  button { cursor:pointer; border:none; border-radius:10px; padding:12px 20px; font-size:14px; font-weight:700;
           transition:transform .1s, opacity .15s; }
  button:active { transform:scale(0.97); }
  .btn-primary { background:linear-gradient(90deg,#6366f1,#a855f7); color:#fff; box-shadow:0 4px 12px rgba(99,102,241,0.3); }
  .btn-primary:hover { opacity:0.92; }

  .filters { display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
  .filters input[type="text"] { flex:1; min-width:180px; }

  .todo-list { display:flex; flex-direction:column; gap:10px; }
  .todo-item { background:#fff; border-radius:14px; padding:16px 18px; display:flex; align-items:flex-start;
               justify-content:space-between; box-shadow:0 2px 10px rgba(0,0,0,0.04); border:1px solid #f1f0fa;
               border-left:4px solid #d1d5db; gap:12px; }
  .todo-item.priority-high { border-left-color:#ef4444; }
  .todo-item.priority-medium { border-left-color:#f59e0b; }
  .todo-item.priority-low { border-left-color:#22c55e; }
  .todo-item.completed { opacity:0.6; }
  .todo-item.completed .task-text { text-decoration:line-through; color:#a1a1aa; }

  .task-left { display:flex; align-items:flex-start; gap:12px; flex:1; min-width:0; }
  .checkbox { width:20px; height:20px; cursor:pointer; margin-top:2px; accent-color:#6366f1; flex-shrink:0; }
  .task-body { display:flex; flex-direction:column; gap:6px; min-width:0; }
  .task-text { font-size:15px; font-weight:600; word-break:break-word; color:#27272a; }
  .task-meta { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }

  .badge { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:capitalize; }
  .badge.high { background:#fee2e2; color:#b91c1c; }
  .badge.medium { background:#fef3c7; color:#92400e; }
  .badge.low { background:#dcfce7; color:#15803d; }

  .due-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; background:#eef2ff; color:#4338ca; }
  .due-badge.overdue { background:#fee2e2; color:#b91c1c; }

  .actions { display:flex; gap:8px; flex-shrink:0; }
  .btn-edit { background:#eef2ff; color:#4338ca; padding:8px 14px; font-size:13px; }
  .btn-delete { background:#fee2e2; color:#b91c1c; padding:8px 14px; font-size:13px; }
  .btn-edit:hover { background:#e0e7ff; }
  .btn-delete:hover { background:#fecaca; }

  .empty { text-align:center; color:#a1a1aa; padding:40px; font-size:14px; }

  @media (max-width:600px){
    .summary { grid-template-columns:repeat(2,1fr); }
    .form-row { flex-direction:column; }
    .filters { flex-direction:column; }
    .todo-item { flex-direction:column; }
    .actions { align-self:flex-end; }
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Todo Dashboard</h1>
    <p>Stay on top of your tasks with priority and deadlines</p>
  </div>

  <div class="summary">
    <div class="card total"><h2 id="totalCount">0</h2><p>Total</p></div>
    <div class="card completed"><h2 id="completedCount">0</h2><p>Done</p></div>
    <div class="card pending"><h2 id="pendingCount">0</h2><p>Pending</p></div>
    <div class="card overdue"><h2 id="overdueCount">0</h2><p>Overdue</p></div>
  </div>

  <div class="panel">
    <h3>Add a new task</h3>
    <div class="form-row">
      <input type="text" id="newTask" placeholder="What needs to be done?" />
      <select id="prioritySelectAdd">
        <option value="high">High</option>
        <option value="medium" selected>Medium</option>
        <option value="low">Low</option>
      </select>
      <input type="date" id="dueDateAdd" />
      <button class="btn-primary" onclick="addTodo()">Add Task</button>
    </div>
  </div>

  <div class="filters">
    <input type="text" id="searchInput" placeholder="Search todos..." oninput="loadTodos()" />
    <select id="filterSelect" onchange="loadTodos()">
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>
    <select id="priorityFilter" onchange="loadTodos()">
      <option value="all">All Priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  </div>

  <div class="todo-list" id="todoList"></div>
</div>

<script>
function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const d = new Date(dueDate);
  const now = new Date();
  const isOverdue = d < now && d.toDateString() !== now.toDateString();
  const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return { label, isOverdue };
}

async function loadTodos() {
  const search = document.getElementById('searchInput').value;
  const filter = document.getElementById('filterSelect').value;
  const priority = document.getElementById('priorityFilter').value;
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (filter && filter !== 'all') params.append('filter', filter);
  if (priority && priority !== 'all') params.append('priority', priority);

  const res = await fetch('/api/todos?' + params.toString());
  const todos = await res.json();
  renderTodos(todos);
  loadSummary();
}

async function loadSummary() {
  const res = await fetch('/api/todos/summary');
  const summary = await res.json();
  document.getElementById('totalCount').textContent = summary.total;
  document.getElementById('completedCount').textContent = summary.completed;
  document.getElementById('pendingCount').textContent = summary.pending;
  document.getElementById('overdueCount').textContent = summary.overdue;
}

function renderTodos(todos) {
  const list = document.getElementById('todoList');
  if (todos.length === 0) {
    list.innerHTML = '<div class="empty">No todos found. Add one above to get started.</div>';
    return;
  }
  list.innerHTML = todos.map(t => {
    const due = formatDueDate(t.dueDate);
    const dueHTML = due
      ? \`<span class="due-badge \${due.isOverdue && !t.completed ? 'overdue' : ''}">Due \${due.label}</span>\`
      : '';
    return \`
    <div class="todo-item priority-\${t.priority} \${t.completed ? 'completed' : ''}">
      <div class="task-left">
        <input type="checkbox" class="checkbox" \${t.completed ? 'checked' : ''} onchange="toggleTodo(\${t.id})" />
        <div class="task-body">
          <span class="task-text">\${escapeHTML(t.task)}</span>
          <div class="task-meta">
            <span class="badge \${t.priority}">\${t.priority}</span>
            \${dueHTML}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="btn-edit" onclick="editTodo(\${t.id}, '\${escapeJS(t.task)}', '\${t.priority}', '\${t.dueDate || ''}')">Edit</button>
        <button class="btn-delete" onclick="deleteTodo(\${t.id})">Delete</button>
      </div>
    </div>
  \`;
  }).join('');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
function escapeJS(str) {
  return String(str).replace(/'/g, "\\\\'");
}

async function addTodo() {
  const input = document.getElementById('newTask');
  const task = input.value.trim();
  const priority = document.getElementById('prioritySelectAdd').value;
  const dueDate = document.getElementById('dueDateAdd').value;
  if (!task) return;

  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, priority, dueDate })
  });

  input.value = '';
  document.getElementById('dueDateAdd').value = '';
  document.getElementById('prioritySelectAdd').value = 'medium';
  loadTodos();
}

async function toggleTodo(id) {
  await fetch('/api/todos/' + id + '/toggle', { method: 'PATCH' });
  loadTodos();
}

async function editTodo(id, currentTask, currentPriority, currentDueDate) {
  const newTask = prompt('Edit task:', currentTask);
  if (newTask === null || !newTask.trim()) return;

  const newPriority = prompt('Priority (high / medium / low):', currentPriority);
  const validPriority = ['high', 'medium', 'low'].includes(newPriority) ? newPriority : currentPriority;

  const newDueDate = prompt('Due date (YYYY-MM-DD, leave blank for none):', currentDueDate);

  await fetch('/api/todos/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: newTask.trim(),
      priority: validPriority,
      dueDate: newDueDate !== null ? newDueDate.trim() : currentDueDate
    })
  });
  loadTodos();
}

async function deleteTodo(id) {
  if (!confirm('Delete this todo?')) return;
  await fetch('/api/todos/' + id, { method: 'DELETE' });
  loadTodos();
}

document.getElementById('newTask').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

loadTodos();
</script>
</body>
</html>`;

// ---------------- Server ----------------
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname.startsWith("/api/")) {
    return handleAPI(req, res, pathname, query);
  }

  if (pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(HTML_PAGE);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});