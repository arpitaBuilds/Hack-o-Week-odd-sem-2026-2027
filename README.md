# Todo List REST API

A simple and clean Todo List REST API built with pure Node.js (`http` module — no Express) featuring a live, responsive dashboard UI. Supports full CRUD operations, search, filtering, and completion tracking.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![REST API](https://img.shields.io/badge/REST-API-blue?style=flat)

## Features

- Add, edit, and delete todos
- Mark todos as complete / pending
- Search todos by task name
- Filter by status (All / Completed / Pending)
- Live summary dashboard (Total, Completed, Pending counts)
- Fully responsive UI — works on mobile and desktop
- Zero external dependencies — built using only Node's native `http` module

## Tech Stack

- **Backend:** Node.js (native `http` module)
- **Frontend:** HTML, CSS, JavaScript (Vanilla, embedded in the same server file)
- **Data Storage:** In-memory (resets on server restart)

## Project Structure

```
todo-list-api/
│
├── server.js        # Backend API + Frontend UI (single file)
└── README.md         # Documentation
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) installed on your machine

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/<your-username>/todo-list-api.git

# Move into the project folder
cd todo-list-api

# Run the server
node server.js
```

The server will start at:

```
http://localhost:3000
```

Open this URL in your browser to use the dashboard.

## API Endpoints

| Method   | Endpoint              | Description                                  |
|----------|------------------------|-----------------------------------------------|
| `GET`    | `/api/todos`           | Get all todos (supports `?search=` & `?filter=`) |
| `GET`    | `/api/todos/summary`   | Get total / completed / pending counts        |
| `GET`    | `/api/todos/:id`       | Get a single todo by ID                       |
| `POST`   | `/api/todos`           | Create a new todo                             |
| `PUT`    | `/api/todos/:id`       | Update a todo's task or status                |
| `PATCH`  | `/api/todos/:id/toggle`| Toggle a todo between complete / pending      |
| `DELETE` | `/api/todos/:id`       | Delete a todo                                 |

### Example Requests

**Create a todo**
```http
POST /api/todos
Content-Type: application/json

{
  "task": "Learn REST APIs"
}
```

**Update a todo**
```http
PUT /api/todos/1
Content-Type: application/json

{
  "task": "Learn REST APIs in depth"
}
```

**Toggle complete/pending**
```http
PATCH /api/todos/1/toggle
```

**Delete a todo**
```http
DELETE /api/todos/1
```

**Search & filter**
```http
GET /api/todos?search=learn&filter=pending
```

## What I Learned

Building this project helped me understand:
- How REST APIs work under the hood using Node's native `http` module (without frameworks like Express)
- Handling different HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and routing logic manually
- Parsing request bodies and URL query parameters
- Connecting a frontend UI to a backend API using `fetch()`
- Structuring in-memory data operations (CRUD)

## Future Improvements

- Add a database (MongoDB) for persistent storage
- Add user authentication (JWT)
- Add due dates and priority levels
- Add pagination for large todo lists

## Author

**Arpita** — ArpitaBuilds
Built as part of my journey toward full-stack development and internship readiness.

## License

This project is open source and available under the MIT License.
