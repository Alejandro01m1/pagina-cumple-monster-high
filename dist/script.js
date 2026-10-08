const views = [...document.querySelectorAll('[data-view]')];
const toast = document.querySelector('#toast');
const storageKey = 'monster-birthday-modules';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }

function openView(id) {
  views.forEach(view => { view.hidden = view.id !== id; view.classList.toggle('active', view.id === id); });
  if (id !== 'welcome') history.replaceState(null, '', `#${id}`);
  else history.replaceState(null, '', location.pathname);
}

document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openView(button.dataset.open)));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.photo-item img').forEach(img => {
  const placeholder = img.nextElementSibling;
  const showImage = () => { img.hidden = false; placeholder.hidden = true; };
  const showPlaceholder = () => { img.hidden = true; placeholder.hidden = false; };
  img.addEventListener('load', showImage);
  img.addEventListener('error', showPlaceholder);
  if (img.complete) img.naturalWidth ? showImage() : showPlaceholder();
});

const coupons = [...document.querySelectorAll('.coupon-card')];
let couponIndex = 0;
function activeCoupons() { return coupons.filter(c => !saved.redeemed?.includes(c.dataset.coupon)); }
function showCoupon(direction = 0) {
  const available = activeCoupons();
  coupons.forEach(c => c.hidden = true);
  const done = document.querySelector('.all-redeemed');
  if (!available.length) { done.hidden = false; document.querySelector('.coupon-nav').hidden = true; return; }
  done.hidden = true; document.querySelector('.coupon-nav').hidden = false;
  couponIndex = (couponIndex + direction + available.length) % available.length;
  available[couponIndex].hidden = false;
  document.querySelector('#couponCount').textContent = `${couponIndex + 1} / ${available.length}`;
}
document.querySelector('#couponPrev').addEventListener('click', () => showCoupon(-1));
document.querySelector('#couponNext').addEventListener('click', () => showCoupon(1));
coupons.forEach(coupon => coupon.querySelector('.redeem').addEventListener('click', () => {
  coupon.classList.add('leaving');
  saved.redeemed ||= [];
  saved.redeemed.push(coupon.dataset.coupon);
  localStorage.setItem(storageKey, JSON.stringify(saved));
  showToast('cupón canjeado ♡');
  setTimeout(() => { coupon.classList.remove('leaving'); couponIndex = 0; showCoupon(); }, 400);
}));
document.querySelector('#restoreCoupons').addEventListener('click', () => { saved.redeemed = []; localStorage.setItem(storageKey, JSON.stringify(saved)); couponIndex = 0; showCoupon(); });
showCoupon();

const initial = location.hash.slice(1);
if (views.some(v => v.id === initial)) openView(initial);
