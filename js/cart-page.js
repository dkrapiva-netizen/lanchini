// ===== CART PAGE =====
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function renderCart() {
  const container = document.getElementById('cart-content');
  const items = Cart.getItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">&#128722;</div>
        <p class="cart-empty__text">Ваша корзина пуста</p>
        <a href="catalog.html" class="btn btn--primary">Перейти в каталог</a>
      </div>
    `;
    return;
  }

  let itemsHTML = '';
  items.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    itemsHTML += `
      <div class="cart-item" data-id="${product.id}">
        <div class="cart-item__image">${product.image}</div>
        <div class="cart-item__info">
          <a href="product.html?id=${product.id}" class="cart-item__name">${product.name}</a>
          <p class="cart-item__desc">${product.desc}</p>
          <div class="quantity" style="margin-top:8px;">
            <button class="quantity__btn cart-qty-minus" data-id="${product.id}" aria-label="Уменьшить количество">&#8722;</button>
            <input class="quantity__value cart-qty-input" type="number" value="${item.qty}" min="1" max="10" data-id="${product.id}">
            <button class="quantity__btn cart-qty-plus" data-id="${product.id}" aria-label="Увеличить количество">&#43;</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="cart-item__price">${(product.price * item.qty).toLocaleString('ru-RU')} &#8381;</div>
          <button class="cart-item__remove" data-id="${product.id}">Удалить</button>
        </div>
      </div>
    `;
  });

  const total = Cart.getTotal();
  const deliveryFree = total >= FREE_DELIVERY_THRESHOLD;

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">${itemsHTML}</div>
      <div class="cart-summary">
        <h3 class="cart-summary__title">Итого</h3>
        <div class="cart-summary__row">
          <span>Товары (${Cart.getCount()} шт.)</span>
          <span>${total.toLocaleString('ru-RU')} &#8381;</span>
        </div>
        <div class="cart-summary__row">
          <span>Доставка</span>
          <span>${deliveryFree ? 'Бесплатно' : DELIVERY_COST + ' &#8381;'}</span>
        </div>
        <div class="cart-summary__row cart-summary__row--total">
          <span>К оплате</span>
          <span>${(deliveryFree ? total : total + DELIVERY_COST).toLocaleString('ru-RU')} &#8381;</span>
        </div>
        <a href="checkout.html" class="btn btn--primary btn--full">Оформить заказ</a>
      </div>
    </div>
  `;

  // Event listeners for quantity changes
  container.querySelectorAll('.cart-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const input = container.querySelector(`.cart-qty-input[data-id="${id}"]`);
      const v = parseInt(input.value);
      if (v > 1) {
        Cart.updateQty(id, v - 1);
        renderCart();
      }
    });
  });

  container.querySelectorAll('.cart-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const input = container.querySelector(`.cart-qty-input[data-id="${id}"]`);
      const v = parseInt(input.value);
      if (v < 10) {
        Cart.updateQty(id, v + 1);
        renderCart();
      }
    });
  });

  container.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Удалить этот товар из корзины?')) return;
      Cart.remove(parseInt(btn.dataset.id));
      renderCart();
      showNotification('Товар удалён из корзины');
    });
  });
}
