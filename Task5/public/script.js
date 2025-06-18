const API_URL = "http://localhost:3000/api/tasks";

const taskList = document.getElementById("taskList");
const addTaskForm = document.getElementById("addTaskForm");
const taskTitleInput = document.getElementById("taskTitle");

// Function to fetch and display tasks
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    taskList.innerHTML = "<li>Failed to load tasks. Please try again.</li>";
  }
}

// Function to display tasks on the UI
function displayTasks(tasks) {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    taskList.innerHTML = "<li>No tasks yet. Add one!</li>";
    return;
  }
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
            <span>${task.title}</span>
            <div class="actions">
                <button class="complete-btn" <span class="math-inline">\{task\.completed ? 'disabled' \: ''\}\></span>{task.completed ? 'Completed' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    taskList.appendChild(li);
  });
}

// Function to add a new task
addTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, completed: false }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newTask = await response.json();
    console.log("New task added:", newTask);
    taskTitleInput.value = "";
    fetchTasks();
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Failed to add task.");
  }
});

// Event delegation for complete and delete buttons
taskList.addEventListener("click", async (event) => {
  const target = event.target;
  const listItem = target.closest("li");
  if (!listItem) return;

  const taskId = listItem.getAttribute("data-id");

  if (target.classList.contains("complete-btn")) {
    try {
      const response = await fetch(`${API_URL}/${taskId}`); 
      const currentTask = await response.json(); 

      const updateResponse = await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !currentTask.completed,
          title: currentTask.title,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }

      const updatedTask = await updateResponse.json();
      console.log("Task updated:", updatedTask);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    }
  } else if (target.classList.contains("delete-btn")) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const deleteResponse = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });

      if (!deleteResponse.ok) {
        throw new Error(`HTTP error! status: ${deleteResponse.status}`);
      }

      console.log("Task deleted:", taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  }
});

fetchTasks();
