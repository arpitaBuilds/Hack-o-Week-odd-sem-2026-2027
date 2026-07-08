const http = require("http");
const url = require("url");
const PORT = 3000;
let todos = [
  { id: 1, task: "Learn REST API", completed: false, createdAt: new Date().toISOString() },
  { id: 2, task: "Build Todo Dashboard", completed: true, createdAt: new Date().toISOString() }
];
let nextId = 3;
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
async function handleAPI(req, res, pathname, query) {
  // GET /api/todos  (supports ?search= & ?filter=all|completed|pending)
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

    return sendJSON(res, 200, result);
  }
  if (pathname === "/api/todos/summary" && req.method === "GET") {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    return sendJSON(res, 200, { total, completed, pending });
  }
  const idMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
  if (idMatch && req.method === "GET") {
    const todo = todos.find((t) => t.id === parseInt(idMatch[1]));
    if (!todo) return sendJSON(res, 404, { message: "Todo not found" });
    return sendJSON(res, 200, todo);
  }
  if (pathname === "/api/todos" && req.method === "POST") {
    try {
      const body = await getRequestBody(req);
      if (!body.task || !body.task.trim()) {
        return sendJSON(res, 400, { message: "Task is required" });
      }
      const newTodo = {
        id: nextId++,
        task: body.task.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      todos.push(newTodo);
      return sendJSON(res, 201, newTodo);
    } catch (err) {
      return sendJSON(res, 400, { message: "Invalid JSON body" });
    }
  }
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
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI', Arial, sans-serif; }
  body { background:#f4f6fb; color:#1f2937; padding:24px; }
  .container { max-width:900px; margin:0 auto; }
  h1 { text-align:center; margin-bottom:20px; color:#111827; }

  .summary { display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap; }
  .card { flex:1; min-width:140px; background:#fff; border-radius:12px; padding:18px; text-align:center;
          box-shadow:0 2px 8px rgba(0,0,0,0.06); }
  .card h2 { font-size:28px; margin-bottom:4px; }
  .card p { color:#6b7280; font-size:14px; }
  .card.total h2 { color:#4f46e5; }
  .card.completed h2 { color:#16a34a; }
  .card.pending h2 { color:#dc2626; }

  .controls { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
  input[type="text"] { flex:1; min-width:200px; padding:12px 14px; border-radius:8px; border:1px solid #d1d5db; font-size:14px; }
  select { padding:12px 14px; border-radius:8px; border:1px solid #d1d5db; font-size:14px; background:#fff; }
  button { cursor:pointer; border:none; border-radius:8px; padding:12px 18px; font-size:14px; font-weight:600; }

  .add-form { display:flex; gap:10px; margin-bottom:24px; }
  .add-form button { background:#4f46e5; color:#fff; }
  .add-form button:hover { background:#4338ca; }

  .todo-list { display:flex; flex-direction:column; gap:10px; }
  .todo-item { background:#fff; border-radius:10px; padding:14px 16px; display:flex; align-items:center;
               justify-content:space-between; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
  .todo-item.completed .task-text { text-decoration:line-through; color:#9ca3af; }
  .task-left { display:flex; align-items:center; gap:12px; flex:1; }
  .task-text { font-size:15px; word-break:break-word; }
  .checkbox { width:20px; height:20px; cursor:pointer; }
  .actions { display:flex; gap:8px; }
  .btn-edit { background:#fef3c7; color:#92400e; }
  .btn-delete { background:#fee2e2; color:#b91c1c; }
  .btn-edit:hover { background:#fde68a; }
  .btn-delete:hover { background:#fecaca; }

  .empty { text-align:center; color:#9ca3af; padding:30px; }

  @media (max-width:600px){
    .add-form { flex-direction:column; }
    .controls { flex-direction:column; }
  }
</style>
</head>
<body>
<div class="container">
  <h1> To-do Dashboard</h1>

  <div class="summary">
    <div class="card total"><h2 id="totalCount">0</h2><p>Total</p></div>
    <div class="card completed"><h2 id="completedCount">0</h2><p>Completed</p></div>
    <div class="card pending"><h2 id="pendingCount">0</h2><p>Pending</p></div>
  </div>

  <div class="add-form">
    <input type="text" id="newTask" placeholder="Add a new todo..." />
    <button onclick="addTodo()">Add</button>
  </div>

  <div class="controls">
    <input type="text" id="searchInput" placeholder="Search todos..." oninput="loadTodos()" />
    <select id="filterSelect" onchange="loadTodos()">
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>
  </div>

  <div class="todo-list" id="todoList"></div>
</div>

<script>
async function loadTodos() {
  const search = document.getElementById('searchInput').value;
  const filter = document.getElementById('filterSelect').value;
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (filter && filter !== 'all') params.append('filter', filter);

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
}

function renderTodos(todos) {
  const list = document.getElementById('todoList');
  if (todos.length === 0) {
    list.innerHTML = '<div class="empty">No todos found</div>';
    return;
  }
  list.innerHTML = todos.map(t => \`
    <div class="todo-item \${t.completed ? 'completed' : ''}">
      <div class="task-left">
        <input type="checkbox" class="checkbox" \${t.completed ? 'checked' : ''} onchange="toggleTodo(\${t.id})" />
        <span class="task-text">\${escapeHTML(t.task)}</span>
      </div>
      <div class="actions">
        <button class="btn-edit" onclick="editTodo(\${t.id}, '\${escapeJS(t.task)}')">Edit</button>
        <button class="btn-delete" onclick="deleteTodo(\${t.id})">Delete</button>
      </div>
    </div>
  \`).join('');
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
  if (!task) return;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });
  input.value = '';
  loadTodos();
}

async function toggleTodo(id) {
  await fetch('/api/todos/' + id + '/toggle', { method: 'PATCH' });
  loadTodos();
}

async function editTodo(id, currentTask) {
  const newTask = prompt('Edit task:', currentTask);
  if (newTask === null || !newTask.trim()) return;
  await fetch('/api/todos/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: newTask.trim() })
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