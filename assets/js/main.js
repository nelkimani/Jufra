// ===== Header scroll state =====
const header = document.getElementById('siteHeader');
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 40);
  if (backTop) backTop.classList.toggle('show', y > 600);
});
if (backTop) backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// ===== Mobile menu =====
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('mobile-open');
    mainNav.style.display = isOpen ? 'block' : 'none';
    if (isOpen) {
      mainNav.style.position = 'fixed';
      mainNav.style.top = '64px'; mainNav.style.left = '0'; mainNav.style.right = '0';
      mainNav.style.background = '#1B5E20';
      mainNav.style.padding = '10px 24px 24px';
      mainNav.querySelectorAll('a').forEach(a => a.style.color = '#fff');
      mainNav.querySelectorAll(':scope > ul').forEach(ul => { ul.style.flexDirection = 'column'; ul.style.gap = '4px'; });
      mainNav.querySelectorAll('.mega').forEach(m => {
        m.style.position = 'static'; m.style.opacity = '1'; m.style.visibility = 'visible';
        m.style.transform = 'none'; m.style.boxShadow = 'none'; m.style.background = 'rgba(255,255,255,.06)';
        m.style.display = 'none';
      });
      mainNav.querySelectorAll('.has-mega > a').forEach(a => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const mega = a.parentElement.querySelector('.mega');
          if (mega) mega.style.display = mega.style.display === 'none' ? 'block' : 'none';
        });
      });
    }
  });
}

// ===== Language switch (UI only — see note in chat) =====
document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-switch button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ===== Counter animation =====
function animateCounters(container) {
  const targets = {};
  container.querySelectorAll('[data-count]').forEach(el => {
    targets[el.dataset.count] = el;
  });
  container.querySelectorAll('.impact-card b[data-target]').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const raw = el.dataset.target;
    const end = parseFloat(raw);
    const suffix = raw.replace(/[0-9.]/g, '');
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const val = Math.floor(p * end);
      el.textContent = (end >= 1000 ? val.toLocaleString() : val) + (p < 1 ? '' : suffix);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (end >= 1000 ? end.toLocaleString() : end) + suffix;
    }
    requestAnimationFrame(tick);
  });
}
document.querySelectorAll('.impact-grid').forEach(grid => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) animateCounters(grid); });
  }, {threshold:.4});
  obs.observe(grid);
});

// ===== Scroll reveal =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, {threshold:.2});
document.querySelectorAll('.impact-card, .recognition-feature, .reveal').forEach(el => revealObs.observe(el));

// ===== Image slider (impact hero) =====
const slides = document.querySelectorAll('.impact-slider .slide');
const dots = document.querySelectorAll('.slider-dots .dot');
let slideIndex = 0;
let sliderTimer;
function showSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slideIndex = (i + slides.length) % slides.length;
  slides[slideIndex].classList.add('active');
  if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}
function nextSlide() { showSlide(slideIndex + 1); }
function startSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 4500);
}
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(parseInt(dot.dataset.i, 10));
    startSlider();
  });
});
if (slides.length) startSlider();

// ===== Product filter (Products page) =====
document.querySelectorAll('.filter-bar button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-bar button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
    });
  });
});

// ===== Forms (front-end only — no backend wired up) =====
document.querySelectorAll('form[data-demo-form]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = form.querySelector('.form-success');
    if (note) { note.style.display = 'block'; }
    form.reset();
  });
});

// ===== Cookie banner =====
const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner && !localStorage_safe_get('jufra_cookie_ack')) {
  setTimeout(() => cookieBanner.classList.add('show'), 800);
}
function localStorage_safe_get(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
const cookieAccept = document.getElementById('cookieAccept');
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    try { localStorage.setItem('jufra_cookie_ack', '1'); } catch (e) {}
    cookieBanner.classList.remove('show');
  });
}
