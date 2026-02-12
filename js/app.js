// ===== APP.JS — Main Application Logic =====

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initBurger();
  initHeroSlider();
  initSearch();
  renderPopularProducts();
  initBackToTop();
});

// ===== BURGER MENU =====
function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

// ===== HERO SLIDER =====
function initHeroSlider() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const slides = hero.querySelectorAll('.hero__slide');
  const dots = hero.querySelectorAll('.hero__dot');
  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    interval = setInterval(next, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goTo(parseInt(dot.dataset.slide));
      startAuto();
    });
  });

  startAuto();
}

// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById('search-input');
  const btn = document.getElementById('search-btn');
  if (!input || !btn) return;

  function doSearch() {
    const query = input.value.trim();
    if (query.length > 0) {
      const isSubPage = window.location.pathname.includes('/pages/');
      const prefix = isSubPage ? '' : 'pages/';
      window.location.href = prefix + 'catalog.html?search=' + encodeURIComponent(query);
    }
  }

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}

// ===== RENDER PRODUCT CARDS =====
function createProductCard(product, pathPrefix = 'pages/') {
  const card = document.createElement('a');
  card.href = pathPrefix + 'product.html?id=' + product.id;
  card.className = 'product-card';

  card.innerHTML = `
    <div class="product-card__image">
      ${product.image}
      ${product.badge ? '<span class="product-card__badge">' + product.badge + '</span>' : ''}
    </div>
    <div class="product-card__info">
      <h3 class="product-card__name">${product.name}</h3>
      <p class="product-card__desc">${product.desc}</p>
      <div class="product-card__bottom">
        <span class="product-card__price">${product.price.toLocaleString('ru-RU')} &#8381;</span>
        <button class="product-card__btn" data-id="${product.id}">В корзину</button>
      </div>
    </div>
  `;

  const addBtn = card.querySelector('.product-card__btn');
  addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    Cart.add(product.id);
    showNotification('Товар добавлен в корзину');
  });

  return card;
}

function renderPopularProducts() {
  const container = document.getElementById('popular-products');
  if (!container) return;
  const popular = products.slice(0, 4);
  popular.forEach(p => container.appendChild(createProductCard(p)));
}

// ===== NOTIFICATION =====
function showNotification(text) {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ===== FORMAT PRICE =====
function formatPrice(num) {
  return num.toLocaleString('ru-RU') + ' \u20BD';
}

// ===== DEBOUNCE =====
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Наверх');
  btn.innerHTML = '&#8593;';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
