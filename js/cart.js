// ===== CART MODULE =====
const Cart = {
  KEY: 'lanchini_cart',

  getItems() {
    const data = localStorage.getItem(this.KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Cart data corrupted, resetting:', e);
      localStorage.removeItem(this.KEY);
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  add(productId, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }
    this.save(items);
  },

  remove(productId) {
    const items = this.getItems().filter(i => i.id !== productId);
    this.save(items);
  },

  updateQty(productId, qty) {
    if (qty < 1) return this.remove(productId);
    const items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      item.qty = qty;
      this.save(items);
    }
  },

  getTotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.qty, 0);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  updateBadge() {
    const badges = document.querySelectorAll('#cart-count');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};
