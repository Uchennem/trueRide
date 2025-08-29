const toggle = document.getElementById('navtoggle');
const nav = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
  if (nav.classList.contains('hidden')) {
    nav.classList.remove('hidden');
    toggle.innerHTML = '❌';
  } else {
    nav.classList.add('hidden');
    toggle.innerHTML = '☰';
  }
});
// Wait 5 seconds, then fade out all messages
setTimeout(() => {
  const flashes = document.querySelectorAll(
    '.flash-messages > div, .serverValidationError li'
  );
  flashes.forEach(flash => {
    flash.style.transition = 'opacity 0.5s';
    flash.style.opacity = 0;
    setTimeout(() => flash.remove(), 500); // remove from DOM
  });
}, 5000);



