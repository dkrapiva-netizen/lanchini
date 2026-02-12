// ===== CATALOG PAGE =====
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('catalog-count');
  const sortSelect = document.getElementById('sort-select');
  const priceFrom = document.getElementById('price-from');
  const priceTo = document.getElementById('price-to');
  const filterBtn = document.getElementById('filter-btn');
  const tabs = document.querySelectorAll('.catalog-tab');

  let activeCategory = 'all';

  // Category tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      render();
    });
  });

  // Check for search query
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search');
  if (searchQuery) {
    document.getElementById('search-input').value = searchQuery;
  }

  function render() {
    let filtered = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search filter
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query)
      );
    }

    // Price filter
    const from = parseFloat(priceFrom.value) || 0;
    const to = parseFloat(priceTo.value) || Infinity;
    filtered = filtered.filter(p => p.price >= from && p.price <= to);

    // Sort
    const sort = sortSelect.value;
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = '';
    countEl.textContent = 'Найдено: ' + filtered.length + ' товаров';

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-light);padding:40px;">Товары не найдены</p>';
      return;
    }

    filtered.forEach(p => grid.appendChild(createProductCard(p, '')));
  }

  const debouncedRender = debounce(render, 300);

  sortSelect.addEventListener('change', render);
  filterBtn.addEventListener('click', render);
  document.getElementById('search-btn').addEventListener('click', render);
  document.getElementById('search-input').addEventListener('input', debouncedRender);
  document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); render(); }
  });

  render();
});
