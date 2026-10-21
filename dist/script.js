const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

const countdown = document.querySelector('.countdown');
function updateCountdown() {
  const end = new Date(countdown.dataset.match).getTime();
  const distance = Math.max(0, end - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  countdown.querySelector('[data-days]').textContent = String(days).padStart(2, '0');
  countdown.querySelector('[data-hours]').textContent = String(hours).padStart(2, '0');
  countdown.querySelector('[data-minutes]').textContent = String(minutes).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 60000);

document.querySelectorAll('[data-tab]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach(tab => tab.setAttribute('aria-selected', 'false'));
    document.querySelectorAll('[data-panel]').forEach(panel => panel.hidden = true);
    button.setAttribute('aria-selected', 'true');
    document.querySelector(`[data-panel="${button.dataset.tab}"]`).hidden = false;
  });
});

const playerViewport = document.querySelector('.players-viewport');
document.querySelectorAll('[data-slide]').forEach(button => {
  button.addEventListener('click', () => {
    const amount = Math.min(330, playerViewport.clientWidth * .75);
    playerViewport.scrollBy({ left: button.dataset.slide === 'next' ? amount : -amount, behavior: 'smooth' });
  });
});

const form = document.querySelector('.newsletter form');
const toast = document.querySelector('.toast');
form.addEventListener('submit', event => {
  event.preventDefault();
  toast.classList.add('show');
  form.reset();
  setTimeout(() => toast.classList.remove('show'), 3200);
});
