// ---------- Product catalog ----------
// Swap `img` for a real photo URL per product when you have one —
// leave blank to keep the icon placeholder.
const ICONS = {
  storage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 10h16M10 4v16"/></svg>',
  vase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3h6l1 4-2 3v9a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-9L8 7l1-4z"/></svg>',
  plant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21V9M12 .jp9C8 9 6 6 6 3c4 0 6 2 6 6zM12 9c0-4 2-6 6-6 0 3-2 6-6 6z"/></svg>',
  ornament: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v6M6 22h12l-2-9H8l-2 9z"/></svg>',
  figure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="3"/><path d="M8 21V13a4 4 0 0 1 8 0v8"/></svg>',
};

const PRODUCTS = [
  { id: 'p1', name: 'Rolling storage cart', cat: 'Storage', icon: 'storage', price: 17000, was: null, img: 'sc.jpeg' },
  { id: 'p2', name: 'Ribbed ceramic vase', cat: 'Vases', icon: 'vase', price: 14500, was: 16500, img: 'rb.jpg' },
  { id: 'p3', name: 'Faux eucalyptus stem, potted', cat: 'Artificial Plants', icon: 'plant', price: 15500, was: 17000, img: 'fe.jpg' },
  { id: 'p4', name: 'Eiffel Tower ornament, pair', cat: 'Ornaments', icon: 'ornament', price: 42800, was: 45000, img: 'ef.jpeg' },
  { id: 'p5', name: 'Fluted table vase', cat: 'Vases', icon: 'vase', price: 12500, was: null, img: 'fv.jpg' },
  { id: 'p6', name: 'Modular shelf organiser', cat: 'Storage', icon: 'storage', price: 26000, was: null, img: 'ms.jpg' },
];

const BUSINESS_WHATSAPP = '2349040832250';
let cart = {}; // id -> qty

// ---------- Render products ----------
function money(n){
  return '₦' + n.toLocaleString('en-NG');
}

function renderFilters(){
  const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
  const wrap = document.getElementById('shop-filters');
  wrap.innerHTML = cats.map((c, i) =>
    `<button class="filter-btn${i === 0 ? ' active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
  wrap.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    wrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.cat);
  });
}

function renderProducts(filter = 'All'){
  const grid = document.getElementById('products-grid');
  const items = filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = items.map(p => `
    <div class="product-card">
      <div class="product-visual" style="${p.img ? '' : `background:${visualBg(p.icon)}`}">
        ${p.was ? `<span class="product-badge">Sale</span>` : ''}
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.parentElement.style.background='${visualBg(p.icon)}'; this.replaceWith(document.createRange().createContextualFragment('${ICONS[p.icon].replace(/'/g, "\\'")}'))">`
          : ICONS[p.icon]}
      </div>
      <div class="product-body">
        <span class="product-cat">${p.cat}</span>
        <span class="product-name">${p.name}</span>
        <div class="product-price-row">
          <span>${p.was ? `<span class="price-was">${money(p.was)}</span>` : ''}<span class="price-now">${money(p.price)}</span></span>
          <button class="add-btn" aria-label="Add ${p.name} to cart" onclick="addToCart('${p.id}')">Add to cart +</button>
        </div>
      </div>
    </div>
  `).join('');
}

function visualBg(icon){
  const map = {
    storage: 'linear-gradient(155deg,#8a8a86,#4b4a46)',
    vase: 'linear-gradient(155deg,#6E1F2E,#3D141E)',
    plant: 'linear-gradient(155deg,#7c8067,#4a4d3b)',
    ornament: 'linear-gradient(155deg,#a8895a,#6b4f2e)',
    figure: 'linear-gradient(155deg,#9a9187,#514c43)',
  };
  return map[icon] || 'linear-gradient(155deg,#8a8a86,#4b4a46)';
}

// ---------- Cart ----------
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  toggleCart(true);
}

function changeQty(id, delta){
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function renderCart(){
  const ids = Object.keys(cart);
  document.getElementById('cart-count').textContent = ids.reduce((s, id) => s + cart[id], 0);

  const itemsEl = document.getElementById('cart-items');
  if (ids.length === 0){
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty — add a piece to get started.</p>';
  } else {
    itemsEl.innerHTML = ids.map(id => {
      const p = PRODUCTS.find(x => x.id === id);
      const qty = cart[id];
      return `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-meta">${money(p.price)} × ${qty}</div>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty('${id}', -1)" aria-label="Remove one">−</button>
            <span>${qty}</span>
            <button class="qty-btn" onclick="changeQty('${id}', 1)" aria-label="Add one">+</button>
          </div>
        </div>`;
    }).join('');
  }

  const total = ids.reduce((sum, id) => sum + cart[id] * PRODUCTS.find(p => p.id === id).price, 0);
  document.getElementById('cart-total-price').textContent = money(total);
  document.querySelector('.checkout-btn').disabled = ids.length === 0;
}

function toggleCart(open){
  document.getElementById('cart-drawer').classList.toggle('open', open);
  document.getElementById('cart-overlay').classList.toggle('open', open);
}

function checkoutWhatsApp(){
  const ids = Object.keys(cart);
  if (ids.length === 0) return;
  const lines = ids.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    return `• ${p.name} × ${cart[id]} — ${money(p.price * cart[id])}`;
  });
  const total = ids.reduce((sum, id) => sum + cart[id] * PRODUCTS.find(p => p.id === id).price, 0);
  const message = `Hi Nova Space Interiors, I'd like to order:\n\n${lines.join('\n')}\n\nTotal: ${money(total)}`;
  window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
}

// ---------- Mobile nav ----------
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
});
document.querySelectorAll('.main-nav a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('main-nav').classList.remove('open'))
);

// ---------- Init ----------
renderFilters();
renderProducts();
renderCart();
