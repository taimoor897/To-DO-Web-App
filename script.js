const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = [];
let token = localStorage.getItem("token") || '';
let currentFilter = 'all';

window.addEventListener('DOMContentLoaded', () => {
  if (!token) {
    alert("You must be logged in to view your tasks.");
    window.location.href = "index.html";
    return;
  }

  renderTasks();

  // ✅ Register form submit logic
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      registerUser();
    });
  }

  // ✅ Login form submit logic
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      loginUser();
    });
  }
});

// ✅ Register function
async function registerUser() {
  const username = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful!');
      token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "tasks.html";
    } else {
      alert(data.message || 'Registration failed!');
    }
  } catch (err) {
    console.error('Registration error:', err);
    alert('Something went wrong!');
  }
}

// ✅ Login function
async function loginUser() {
  const username = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Login successful!');
      token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "tasks.html";
    } else {
      alert(data.message || 'Login failed!');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Something went wrong!');
  }
}

// ✅ Task submission
if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add task');
      }

      const newTask = await res.json();
      taskInput.value = '';
      renderTasks(currentFilter);
    } catch (err) {
      console.error("Error adding task:", err.message);
      alert("Error adding task: " + err.message);
    }
  });
}

// ✅ Load tasks
async function renderTasks(filter = 'all') {
  try {
    const res = await fetch('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to fetch tasks');
    }

    const fetchedTasks = await res.json();

    const filtered = fetchedTasks.filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    });

    taskList.innerHTML = '';
    filtered.forEach((task) => addTaskToDOM(task));
  } catch (err) {
    console.error('Error loading tasks:', err.message);
    alert('Error loading tasks: ' + err.message);
  }
}

// ✅ Add task to DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = task.text;
  if (task.completed) span.classList.add('task-completed');
  span.addEventListener('click', () => toggleComplete(task._id));

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.addEventListener('click', () => deleteTask(task._id));

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// ✅ Toggle task status
async function toggleComplete(id) {
  try {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    renderTasks(currentFilter);
  } catch (err) {
    console.error('Failed to toggle task:', err.message);
  }
}

// ✅ Delete task
async function deleteTask(id) {
  try {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    renderTasks(currentFilter);
  } catch (err) {
    console.error('Failed to delete task:', err.message);
  }
}

// ✅ Filter logic
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks(currentFilter);
  });
});
