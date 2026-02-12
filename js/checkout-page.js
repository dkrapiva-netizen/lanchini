// ===== CHECKOUT PAGE =====

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, c => map[c]);
}

document.addEventListener('DOMContentLoaded', () => {
  const TG_TOKEN = '8399901516:AAHPlNobhUb37QV044xsbIddPaYZI9Es49g';
  const TG_CHAT_ID = '7307792405';

  const items = Cart.getItems();
  const summary = document.getElementById('order-summary');
  const total = Cart.getTotal();

  if (items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  let itemsHTML = '';
  items.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return;
    itemsHTML += `
      <div class="cart-summary__row">
        <span>${p.name} x${item.qty}</span>
        <span>${(p.price * item.qty).toLocaleString('ru-RU')} &#8381;</span>
      </div>
    `;
  });

  const deliveryFree = total >= FREE_DELIVERY_THRESHOLD;

  summary.innerHTML = `
    <h3 class="cart-summary__title">Ваш заказ</h3>
    ${itemsHTML}
    <div class="cart-summary__row">
      <span>Доставка</span>
      <span>${deliveryFree ? 'Бесплатно' : DELIVERY_COST + ' &#8381;'}</span>
    </div>
    <div class="cart-summary__row cart-summary__row--total">
      <span>Итого</span>
      <span>${(deliveryFree ? total : total + DELIVERY_COST).toLocaleString('ru-RU')} &#8381;</span>
    </div>
  `;

  // Phone validation — Russian format
  document.getElementById('phone').addEventListener('input', function() {
    const digits = this.value.replace(/\D/g, '');
    if (digits.length === 0) {
      this.setCustomValidity('');
    } else if (digits.length < 11) {
      this.setCustomValidity('Введите номер телефона в формате +7 (XXX) XXX-XX-XX');
    } else if (digits[0] !== '7' && digits[0] !== '8') {
      this.setCustomValidity('Номер должен начинаться с +7 или 8');
    } else {
      this.setCustomValidity('');
    }
  });

  // Form submit — send to Telegram
  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = e.target.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const name = escapeHtml(document.getElementById('name').value);
    const phone = escapeHtml(document.getElementById('phone').value);
    const email = escapeHtml(document.getElementById('email').value);
    const city = escapeHtml(document.getElementById('city').value);
    const address = escapeHtml(document.getElementById('address').value);
    const zip = escapeHtml(document.getElementById('zip').value);
    const delivery = document.getElementById('delivery').value;
    const comment = escapeHtml(document.getElementById('comment').value);

    const deliveryNames = { courier: 'Курьер', post: 'Почта России', cdek: 'СДЭК' };
    const orderDeliveryFree = total >= FREE_DELIVERY_THRESHOLD;
    const orderTotal = orderDeliveryFree ? total : total + DELIVERY_COST;

    let itemsText = '';
    items.forEach(item => {
      const p = products.find(pr => pr.id === item.id);
      if (p) itemsText += `  • ${escapeHtml(p.name)} x${item.qty} — ${(p.price * item.qty).toLocaleString('ru-RU')} ₽\n`;
    });

    const message = `🛍 <b>НОВЫЙ ЗАКАЗ — LANCHINI</b>\n\n`
      + `👤 <b>Покупатель:</b> ${name}\n`
      + `📞 <b>Телефон:</b> ${phone}\n`
      + (email ? `📧 <b>Email:</b> ${email}\n` : '')
      + `\n📍 <b>Адрес доставки:</b>\n`
      + `Город: ${city}\n`
      + `Адрес: ${address}\n`
      + (zip ? `Индекс: ${zip}\n` : '')
      + `Способ: ${deliveryNames[delivery] || delivery}\n`
      + `\n🛒 <b>Состав заказа:</b>\n${itemsText}`
      + `\n💰 Товары: ${total.toLocaleString('ru-RU')} ₽\n`
      + `🚚 Доставка: ${orderDeliveryFree ? 'Бесплатно' : DELIVERY_COST + ' ₽'}\n`
      + `💳 <b>ИТОГО: ${orderTotal.toLocaleString('ru-RU')} ₽</b>`
      + (comment ? `\n\n💬 <b>Комментарий:</b> ${comment}` : '');

    try {
      const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: 'HTML' })
      });

      const result = await response.json();

      if (result.ok) {
        Cart.clear();
        document.querySelector('.checkout-page .container').innerHTML = `
          <div style="text-align:center;padding:80px 0;">
            <div style="font-size:4rem;margin-bottom:16px;">&#10004;</div>
            <h1 class="checkout-page__title">Спасибо за заказ!</h1>
            <p style="color:var(--text-light);font-size:1.1rem;margin-bottom:24px;">Мы свяжемся с вами в ближайшее время для подтверждения.</p>
            <a href="../index.html" class="btn btn--primary">На главную</a>
          </div>
        `;
      } else {
        throw new Error('Telegram error');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Подтвердить заказ';
      showNotification('Ошибка отправки. Позвоните нам: +7 (999) 123-45-67');
    }
  });
});
