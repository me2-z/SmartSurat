document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toggleToRegister = document.getElementById("toggleToRegister");
  const toggleToLogin = document.getElementById("toggleToLogin");

  // Flip card animations
  toggleToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".auth-inner").classList.add("show-register");
  });

  toggleToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".auth-inner").classList.remove("show-register");
  });

  // LOGIN form
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        alert("Welcome back, " + data.user.name + "!");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Try again later.");
    }
  });

  // REGISTER form (demo disabled)
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Registration is disabled in demo mode.\nUse demo login:\nEmail: meet@gmail.com\nPassword: meetzanzmera");
  });
});
