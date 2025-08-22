// Add 'up' class on focusin, remove it on focusout
document.getElementById("password").addEventListener("focusin", function() {
  document.querySelector("form").classList.add("up");
});
document.getElementById("password").addEventListener("focusout", function() {
  document.querySelector("form").classList.remove("up");
});

// Panda Eye move
document.addEventListener("mousemove", function(event) {
  var dw = document.documentElement.clientWidth / 15;
  var dh = document.documentElement.clientHeight / 15;
  var x = event.pageX / dw;
  var y = event.pageY / dh;
  var eyeBalls = document.querySelectorAll(".eye-ball");

  eyeBalls.forEach(function(eyeBall) {
    eyeBall.style.width = x + "px";
    eyeBall.style.height = y + "px";
  });
});

// Validation
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");
  const loginFailed = loginForm.getAttribute("data-login-failed") === "true";

  if (loginFailed) {
      // Add the 'wrong-entry' class to trigger the animation
      loginForm.classList.add("wrong-entry");

      // Remove the class after 3 seconds
      setTimeout(function() { 
          loginForm.classList.remove("wrong-entry");
      }, 3000);
  }
})
