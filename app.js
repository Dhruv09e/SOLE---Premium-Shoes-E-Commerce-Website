// ── SOLE App State (mock/demo, no real backend) ──

const PRODUCTS = [
  { id: 1, name: 'Phantom X Pro', category: 'Running', price: 8999, tag: 'Bestseller', color: '#0D0D0D', bg: '#F5F0E8' },
  { id: 2, name: 'Drift Low',     category: 'Lifestyle', price: 6499, tag: '',          color: '#C8502A', bg: '#E8E3D5' },
  { id: 3, name: 'Noir Mid',      category: 'Urban',     price: 7299, tag: 'New',       color: '#3a3a3a', bg: '#DDD8CE' },
  { id: 4, name: 'Coast Runner',  category: 'Trail',     price: 9499, tag: '',          color: '#185FA5', bg: '#E5EBF0' },
  { id: 5, name: 'Terra Hike',    category: 'Trail',     price: 10999, tag: 'Limited',  color: '#3B6D11', bg: '#EAF3DE' },
  { id: 6, name: 'Blaze Street',  category: 'Lifestyle', price: 5999, tag: '',          color: '#993556', bg: '#FBEAF0' },
];

const MOCK_USERS = [
  { email: 'demo@sole.in', password: 'demo123', name: 'Arjun Mehta' },
  { email: 'test@sole.in', password: 'test123', name: 'Priya Shah' },
];

// ── Cart ──
function getCart() {
  try { return JSON.parse(localStorage.getItem('sole_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('sole_cart', JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(productId, size = '8') {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId && i.size === size);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id: productId, size, qty: 1 }); }
  saveCart(cart);
  showToast('Added to cart!');
}
function removeFromCart(productId, size) {
  saveCart(getCart().filter(i => !(i.id === productId && i.size === size)));
}
function updateQty(productId, size, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId && i.size === size);
  if (item) { item.qty = qty; if (item.qty < 1) removeFromCart(productId, size); else saveCart(cart); }
}
function getCartTotal() {
  return getCart().reduce((sum, i) => {
    const p = PRODUCTS.find(p => p.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}
function updateCartBadge() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count > 0 ? count : '';
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── Auth ──
function getUser() {
  try { return JSON.parse(localStorage.getItem('sole_user') || 'null'); } catch { return null; }
}
function loginUser(email, password) {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (user) { localStorage.setItem('sole_user', JSON.stringify(user)); return user; }
  return null;
}
function logoutUser() { localStorage.removeItem('sole_user'); window.location.href = 'index.html'; }

// ── Toast ──
function showToast(msg, type = 'success') {
  let t = document.getElementById('sole-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'sole-toast';
    t.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);
      background:#0D0D0D;color:#F5F0E8;padding:.85rem 2rem;font-family:'DM Sans',sans-serif;
      font-size:.85rem;font-weight:600;letter-spacing:.08em;z-index:9999;
      transition:transform .3s ease;white-space:nowrap;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  if (type === 'error') t.style.background = '#C8502A';
  else t.style.background = '#0D0D0D';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(100px)'; }, 2800);
}

// ── Nav HTML (shared) ──
function renderNav(activePage) {
  const user = getUser();
  const cartCount = getCart().reduce((s, i) => s + i.qty, 0);
  return `
  <nav style="position:fixed;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;
    padding:1.4rem 3.5rem;z-index:100;background:rgba(245,240,232,0.92);backdrop-filter:blur(12px);
    border-bottom:1px solid rgba(13,13,13,0.08);">
    <a href="index.html" style="font-family:'Bebas Neue',sans-serif;font-size:1.9rem;letter-spacing:.15em;color:#0D0D0D;text-decoration:none;">SOLE</a>
    <ul style="display:flex;gap:2.5rem;list-style:none;margin:0;padding:0;">
      <li><a href="index.html" style="font-size:.78rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:${activePage==='home'?'#C8502A':'#0D0D0D'};">Home</a></li>
      <li><a href="index.html#collection" style="font-size:.78rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:#0D0D0D;">Shop</a></li>
      <li><a href="${user ? '#' : 'login.html'}" onclick="${user ? 'logoutUser();return false' : ''}"
        style="font-size:.78rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:#0D0D0D;">
        ${user ? '👤 '+user.name.split(' ')[0] : 'Login'}</a></li>
    </ul>
    <a href="cart.html" style="font-size:.78rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;
      color:#0D0D0D;border:1px solid #0D0D0D;padding:.45rem 1.25rem;position:relative;display:flex;align-items:center;gap:.5rem;">
      Cart
      <span class="cart-badge" style="background:#C8502A;color:white;font-size:.6rem;border-radius:50%;
        width:18px;height:18px;display:${cartCount>0?'flex':'none'};align-items:center;justify-content:center;">${cartCount||''}</span>
    </a>
  </nav>`;
}

// Shoe SVG by product id
function shoeSVG(id, small = false) {
  const colors = {
    1: { upper: '#F5F0E8', sole: '#0D0D0D', accent: '#C8502A', bg: '#F5F0E8' },
    2: { upper: '#F5F0E8', sole: '#2d2d2d', accent: '#C8502A', bg: '#E8E3D5' },
    3: { upper: '#3a3a3a', sole: '#0D0D0D', accent: '#C8502A', bg: '#DDD8CE' },
    4: { upper: '#B8C8D8', sole: '#1a2a3a', accent: '#0D0D0D', bg: '#E5EBF0' },
    5: { upper: '#c8d8b8', sole: '#1a2a1a', accent: '#3B6D11', bg: '#EAF3DE' },
    6: { upper: '#f0d0e0', sole: '#2a1020', accent: '#993556', bg: '#FBEAF0' },
  };
  const c = colors[id] || colors[1];
  const s = small ? 'width:60%;' : 'width:80%;';
  return `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="${s}">
    <ellipse cx="150" cy="185" rx="115" ry="11" fill="${c.sole}" opacity=".5"/>
    <path d="M35 170 Q95 180 188 177 Q240 175 260 163 L254 155 Q226 163 181 166 Q88 170 33 160Z" fill="${c.sole}"/>
    <path d="M38 162 Q78 147 118 143 Q158 139 196 142 Q226 145 246 156 L238 163 Q212 157 166 155 Q108 153 38 165Z" fill="${c.upper}"/>
    <path d="M40 165 Q50 151 72 146 Q90 142 110 144 Q118 145 120 150 Q110 155 92 156 Q68 158 40 161Z" fill="${c.upper}" opacity=".7"/>
    <path d="M120 142 Q158 137 198 140 Q224 142 240 152 Q230 160 214 162 Q189 156 151 154 Q119 152 118 150Z" fill="${c.upper}" opacity=".85"/>
    <path d="M240 151 Q252 141 248 129 Q242 118 230 116 Q218 115 212 125 Q208 136 220 147Z" fill="${c.upper}" opacity=".8"/>
    <line x1="132" y1="145" x2="132" y2="153" stroke="${c.accent}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="151" y1="143" x2="151" y2="151" stroke="${c.accent}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="170" y1="142" x2="170" y2="150" stroke="${c.accent}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="189" y1="142" x2="189" y2="150" stroke="${c.accent}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="208" y1="143" x2="208" y2="151" stroke="${c.accent}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M132 149 Q151 146 170 146 Q189 146 208 148" stroke="${c.accent}" stroke-width="1.5" fill="none"/>
    <text x="148" y="164" font-family="'Bebas Neue',sans-serif" font-size="13" fill="${c.accent}" text-anchor="middle" letter-spacing="3" opacity=".7">SOLE</text>
  </svg>`;
}

window.addEventListener('DOMContentLoaded', updateCartBadge);   