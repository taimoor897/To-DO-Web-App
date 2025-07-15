const token = localStorage.getItem("token");
const addTaskForm = document.getElementById("addTaskForm");
const taskInput = document.getElementById("taskInput");
const startDateInput = document.getElementById("startDateInput");
const endDateInput = document.getElementById("endDateInput");
const taskList = document.getElementById("taskList");

if (!token) {
  alert("Please log in first.");
  window.location.href = "index.html";
}

// ✅ Load tasks when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

// ✅ Add new task
addTaskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!text || !startDate || !endDate) {
    alert("Please fill all fields.");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/tasks",
      { text, startDate, endDate },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    taskInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    loadTasks();
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    console.error("Add task error:", msg);
    alert("Error adding task: " + msg);
  }
});

// ✅ Load tasks from server
async function loadTasks() {
  try {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    taskList.innerHTML = "";
    res.data.forEach(addTaskToDOM);
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    console.error("Load tasks error:", msg);
    alert("Error loading tasks: " + msg);
  }
}

// ✅ Render single task with countdown
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.className = "task-text";

  const now = new Date();
  const end = new Date(task.endDate);
  const start = new Date(task.startDate);

  let statusText = "";
  const timeLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  if (task.completed) {
    statusText = "✅ Done";
  } else if (timeLeft < 0) {
    statusText = "❗ Overdue";
  } else if (timeLeft === 0) {
    statusText = "⏳ Due Today";
  } else {
    statusText = `⏳ ${timeLeft} day${timeLeft !== 1 ? "s" : ""} left`;
  }

  span.textContent = `${task.text} (${statusText})`;

  if (task.completed) span.classList.add("task-completed");
  span.addEventListener("click", () => toggleComplete(task._id));

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "&times;";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => deleteTask(task._id));

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// ✅ Toggle task complete
async function toggleComplete(id) {
  try {
    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadTasks();
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    console.error("Toggle complete error:", msg);
    alert("Error toggling task: " + msg);
  }
}

// ✅ Delete task
async function deleteTask(id) {
  try {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadTasks();
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    console.error("Delete task error:", msg);
    alert("Error deleting task: " + msg);
  }
}

// ✅ Logout handler
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});
