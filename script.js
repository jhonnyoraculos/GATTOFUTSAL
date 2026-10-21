const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const hero = document.querySelector('.hero');
const heroLogo = document.querySelector('.hero-logo');
const heroCopy = document.querySelector('.hero-copy');
const heroVisual = document.querySelector('.hero-visual');
const nextMatch = document.querySelector('.next-match');
const aboutCrest = document.querySelector('.about-crest');
const aboutCrestLogo = document.querySelector('.about-crest img');
const isMobileMotion = window.matchMedia('(max-width: 760px)').matches;
let scrollFrame = 0;

function prepareFlyingTitles() {
  if (prefersReducedMotion) return;

  const titles = document.querySelectorAll('.section-heading h2, .games-top h2');
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('letters-landed');
      titleObserver.unobserve(entry.target);
    });
  }, { threshold: .45, rootMargin: '0px 0px -8% 0px' });

  titles.forEach((title, titleIndex) => {
    const label = title.textContent.trim();
    title.textContent = '';
    title.classList.add('fly-title');
    title.setAttribute('aria-label', label);

    let letterIndex = 0;
    label.split(/\s+/).forEach((word, wordIndex, words) => {
      const wordElement = document.createElement('span');
      wordElement.className = 'fly-word';
      wordElement.setAttribute('aria-hidden', 'true');

      [...word].forEach(character => {
        const letter = document.createElement('span');
        const direction = (letterIndex + titleIndex) % 2 === 0 ? -1 : 1;
        const travel = Math.min(window.innerWidth * .72, 820) + (letterIndex % 3) * 90;
        letter.className = 'fly-letter';
        letter.textContent = character;
        letter.style.setProperty('--fly-x', `${direction * travel}px`);
        letter.style.setProperty('--fly-y', `${((letterIndex % 5) - 2) * 54}px`);
        letter.style.setProperty('--fly-r', `${direction * (95 + (letterIndex % 4) * 36)}deg`);
        letter.style.setProperty('--fly-delay', `${letterIndex * 42}ms`);
        wordElement.appendChild(letter);
        letterIndex += 1;
      });

      title.appendChild(wordElement);
      if (wordIndex < words.length - 1) title.appendChild(document.createTextNode(' '));
    });

    titleObserver.observe(title);
  });
}

function launchScreenBall() {
  const ball = document.createElement('div');
  ball.className = 'screen-ball';
  ball.setAttribute('aria-hidden', 'true');
  ball.innerHTML = '<span>⚽</span>';
  document.body.appendChild(ball);
  requestAnimationFrame(() => requestAnimationFrame(() => ball.classList.add('is-flying')));
  ball.addEventListener('animationend', event => {
    if (event.target === ball) ball.remove();
  });
}

function spinHeroCrest() {
  if (!heroLogo) return;
  heroLogo.classList.remove('is-spinning');
  void heroLogo.offsetWidth;
  heroLogo.classList.add('is-spinning');
}

function launchBallAtCrest() {
  if (!heroLogo) return;

  const crestRect = heroLogo.getBoundingClientRect();
  const ballSize = window.innerWidth <= 480 ? 58 : 74;
  const hitX = Math.max(40, Math.min(window.innerWidth - ballSize, crestRect.left + crestRect.width * .26 - ballSize / 2));
  const hitY = Math.max(110, Math.min(window.innerHeight - ballSize - 18, crestRect.top + crestRect.height * .3 - ballSize / 2));
  const startY = Math.max(120, hitY - Math.min(190, window.innerHeight * .22));
  const ball = document.createElement('div');
  ball.className = 'screen-ball crest-strike';
  ball.setAttribute('aria-hidden', 'true');
  ball.innerHTML = '<span>⚽</span>';
  ball.style.setProperty('--strike-start-y', `${startY}px`);
  ball.style.setProperty('--strike-hit-x', `${hitX}px`);
  ball.style.setProperty('--strike-hit-y', `${hitY}px`);
  document.body.appendChild(ball);

  const impactTimer = window.setTimeout(() => {
    heroLogo.classList.add('is-hit');
    spinHeroCrest();
  }, 980);

  requestAnimationFrame(() => requestAnimationFrame(() => ball.classList.add('is-striking')));
  ball.addEventListener('animationend', event => {
    if (event.target !== ball) return;
    window.clearTimeout(impactTimer);
    heroLogo.classList.remove('is-hit');
    ball.remove();
  });
}

prepareFlyingTitles();

if (!prefersReducedMotion && !isMobileMotion) {
  const ballTrigger = document.querySelector('#elenco');
  if (ballTrigger) {
    const ballObserver = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      launchScreenBall();
      ballObserver.disconnect();
    }, { threshold: .2 });
    ballObserver.observe(ballTrigger);
  }
}

function updateScrollScene() {
  scrollFrame = 0;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pageProgress = Math.min(1, window.scrollY / maxScroll);
  root.style.setProperty('--scroll-progress', pageProgress.toFixed(4));

  if (!prefersReducedMotion && hero) {
    const heroProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight)));
    if (heroLogo) {
      heroLogo.style.setProperty('--hero-scroll-y', `${heroProgress * 82}px`);
      heroLogo.style.setProperty('--hero-scroll-rotate', `${heroProgress * 24}deg`);
      heroLogo.style.setProperty('--hero-scroll-scale', `${1 - heroProgress * .12}`);
    }
    if (heroCopy) {
      heroCopy.style.setProperty('--hero-copy-y', `${heroProgress * -38}px`);
      heroCopy.style.setProperty('--hero-copy-opacity', `${1 - heroProgress * .42}`);
    }
    if (heroVisual) {
      heroVisual.style.setProperty('--hero-glow', `${1 + heroProgress * .35}`);
      heroVisual.style.setProperty('--hero-glow-opacity', `${.55 - heroProgress * .22}`);
    }
    if (nextMatch) nextMatch.style.setProperty('--match-x', `${heroProgress * 28}px`);
  }

  if (!prefersReducedMotion && aboutCrest) {
    const rect = aboutCrest.getBoundingClientRect();
    const centerOffset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
    aboutCrest.style.transform = `rotateY(${centerOffset * 5}deg) rotateX(${centerOffset * -3}deg)`;
  }
}

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollScene);
}, { passive: true });
window.addEventListener('resize', updateScrollScene);
updateScrollScene();

if (heroLogo && !prefersReducedMotion) {
  heroLogo.addEventListener('click', () => {
    spinHeroCrest();
  });
  heroLogo.addEventListener('animationend', event => {
    if (event.animationName === 'crestSurprise') heroLogo.classList.remove('is-spinning');
  });

  const crestIntroObserver = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    window.setTimeout(launchBallAtCrest, isMobileMotion ? 140 : 650);
    crestIntroObserver.disconnect();
  }, { threshold: isMobileMotion ? .62 : .55 });
  crestIntroObserver.observe(heroLogo);
}

if (aboutCrestLogo && !prefersReducedMotion) {
  const aboutCrestObserver = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    aboutCrestLogo.classList.add('is-spinning');
    aboutCrestObserver.disconnect();
  }, { threshold: .6 });
  aboutCrestObserver.observe(aboutCrestLogo);
}

const motionItems = document.querySelectorAll('.game-row, .partner-row span, .purpose-list > div');
const motionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('motion-in');
      motionObserver.unobserve(entry.target);
    }
  });
}, { threshold: .16 });
motionItems.forEach((item, index) => {
  item.classList.add('motion-item');
  item.style.setProperty('--motion-delay', `${(index % 5) * 70}ms`);
  motionObserver.observe(item);
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const end = Number(element.dataset.count);
    const start = Number(element.dataset.start || 0);
    const duration = 1100;
    const started = performance.now();
    function count(now) {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(count);
    }
    requestAnimationFrame(count);
    counterObserver.unobserve(element);
  });
}, { threshold: .65 });
document.querySelectorAll('[data-count]').forEach(element => counterObserver.observe(element));

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
if (countdown) {
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

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
    if (!playerViewport) return;
    const cards = [...playerViewport.querySelectorAll('.player-card')];
    if (!cards.length) return;
    const viewportCenter = playerViewport.scrollLeft + playerViewport.clientWidth / 2;
    const currentIndex = cards.reduce((bestIndex, card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const bestCard = cards[bestIndex];
      const bestCenter = bestCard.offsetLeft + bestCard.offsetWidth / 2;
      return Math.abs(cardCenter - viewportCenter) < Math.abs(bestCenter - viewportCenter) ? index : bestIndex;
    }, 0);
    const direction = button.dataset.slide === 'next' ? 1 : -1;
    const targetIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
    cards[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
});

const form = document.querySelector('.newsletter form');
const toast = document.querySelector('.toast');
if (form && toast) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    toast.classList.add('show');
    form.reset();
    setTimeout(() => toast.classList.remove('show'), 3200);
  });
}
