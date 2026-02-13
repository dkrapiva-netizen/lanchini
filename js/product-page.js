// ===== PRODUCT PAGE =====
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = products.find(p => p.id === id);

  if (!product) {
    document.getElementById('product-content').innerHTML = '<p style="text-align:center;padding:60px;color:var(--text-light);">Товар не найден</p>';
    return;
  }

  document.title = product.name + ' — LANCHINI';
  document.getElementById('breadcrumb-name').textContent = product.name;

  const specsHTML = Object.entries(product.specs).map(([key, val]) =>
    `<tr><td>${key}</td><td>${val}</td></tr>`
  ).join('');

  document.getElementById('product-content').innerHTML = `
    <div class="product-gallery">
      <div class="product-gallery__main">${product.image}</div>
      <div class="product-gallery__thumbs">
        <div class="product-gallery__thumb active">${product.image}</div>
        <div class="product-gallery__thumb">&#127873;</div>
        <div class="product-gallery__thumb">&#9749;</div>
      </div>
    </div>
    <div class="product-details">
      <h1 class="product-details__title">${product.name}</h1>
      <div class="product-details__price">${product.price.toLocaleString('ru-RU')} &#8381;</div>
      <p class="product-details__desc">${product.details}</p>
      <div class="product-details__specs">
        <h3>Характеристики</h3>
        <table>${specsHTML}</table>
      </div>
      <div class="product-details__actions">
        <div class="quantity">
          <button class="quantity__btn" id="qty-minus" aria-label="Уменьшить количество">&#8722;</button>
          <input class="quantity__value" type="number" id="qty-input" value="1" min="1" max="10">
          <button class="quantity__btn" id="qty-plus" aria-label="Увеличить количество">&#43;</button>
        </div>
        <button class="btn btn--primary" id="add-to-cart">В корзину</button>
      </div>
    </div>
  `;

  // Quantity controls
  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-minus').addEventListener('click', () => {
    const v = parseInt(qtyInput.value);
    if (v > 1) qtyInput.value = v - 1;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    const v = parseInt(qtyInput.value);
    if (v < 10) qtyInput.value = v + 1;
  });

  // Add to cart
  document.getElementById('add-to-cart').addEventListener('click', () => {
    const qty = Math.min(10, Math.max(1, parseInt(qtyInput.value) || 1));
    Cart.add(product.id, qty);
    showNotification('Товар добавлен в корзину');
  });

  // Similar products
  const similar = products.filter(p => p.id !== product.id).slice(0, 4);
  const grid = document.getElementById('similar-products');
  similar.forEach(p => grid.appendChild(createProductCard(p, '')));
});
