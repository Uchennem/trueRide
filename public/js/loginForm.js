document.addEventListener("DOMContentLoaded", function() {
  const passwordInput = document.getElementById("account_password");
  const loginForm = document.getElementById("loginForm");

  if (passwordInput && loginForm) {
    // Panda goes up/down with focus
    passwordInput.addEventListener("focusin", () => loginForm.classList.add("up"));
    passwordInput.addEventListener("focusout", () => loginForm.classList.remove("up"));

    // Trigger shake if login failed
    const loginFailed = loginForm.getAttribute("data-login-failed") === "true";
    if (loginFailed) {
      loginForm.classList.remove("wrong-entry"); // reset
      void loginForm.offsetWidth; // force reflow
      loginForm.classList.add("wrong-entry"); // play animation
    }
  }

  // Panda eyes follow mouse
  document.addEventListener("mousemove", function(event) {
    const dw = document.documentElement.clientWidth / 15;
    const dh = document.documentElement.clientHeight / 15;
    const x = event.pageX / dw;
    const y = event.pageY / dh;
    const eyeBalls = document.querySelectorAll(".eye-ball");

    eyeBalls.forEach(eyeBall => {
      eyeBall.style.width = x + "px";
      eyeBall.style.height = y + "px";
    });
  });
});
