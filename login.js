const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// ✅ Login handler
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await axios.post("http://localhost:5000/api/users/login", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
    window.location.href = "tasks.html";
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    console.error("Login error:", err);
    alert("Login failed: " + msg);
  }
});

// ✅ Register handler
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const res = await axios.post("http://localhost:5000/api/users/register", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);
    alert("Registration successful!");
    window.location.href = "tasks.html";
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    console.error("Registration error:", err);
    alert("Registration failed: " + msg);
  }
});

// ✅ Toggle forms
function showRegister() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("registerBox").classList.remove("hidden");
}
function showLogin() {
  document.getElementById("registerBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}
