const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

let tasks = [];
let nextId = 1;

app.use(express.static("public"));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- API Endpoints ---

// 1. GET all tasks (Read)
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// 2. GET a single task by ID (Read)
app.get("/api/tasks/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// 3. POST a new task (Create)
app.post("/api/tasks", (req, res) => {
  const { title, completed } = req.body;
  if (!title) {
    return res.status(400).send("Title is required");
  }
  const newTask = { id: nextId++, title, completed: completed || false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 4. PUT/PATCH update an existing task (Update)
app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  let taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      completed:
        typeof completed === "boolean" ? completed : tasks[taskIndex].completed,
    };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send("Task not found");
  }
});

// 5. DELETE a task (Delete)
app.delete("/api/tasks/:taskId", (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: "Task deleted successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
