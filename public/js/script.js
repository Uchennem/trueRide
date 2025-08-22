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

