const products = {
  "Noir Intense": { price: 4500, category: "woody" },
  "Rose Éclat": { price: 3800, category: "floral" },
  "Golden Hour": { price: 5200, category: "warm" },
  "Santal Muse": { price: 4900, category: "woody" },
  "Amber Bloom": { price: 4200, category: "floral" }
};
const cart = {};
const money = amount => "Rs. " + amount.toLocaleString("en-PK");
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let toastTimer;

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2400);
}
function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [name, qty]) => sum + products[name].price * qty, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartTotal").textContent = money(total);
  $("#cartItems").innerHTML = entries.length ? entries.map(([name, qty]) => `
    <div class="cart-line">
      <div><strong>${name}</strong><small>${money(products[name].price)} each</small>
        <div class="qty-controls">
          <button data-qty="-1" data-name="${name}" aria-label="Decrease ${name} quantity">−</button>
          <span>${qty}</span>
          <button data-qty="1" data-name="${name}" aria-label="Increase ${name} quantity">+</button>
          <button class="remove-item" data-remove="${name}">Remove</button>
        </div>
      </div><strong>${money(products[name].price * qty)}</strong>
    </div>`).join("") : '<p class="cart-empty">Your bag is waiting for something lovely.</p>';
}
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#cartBackdrop").hidden = false;
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#cartBackdrop").hidden = true;
}
function addToCart(name) {
  if (!products[name]) return;
  cart[name] = (cart[name] || 0) + 1;
  renderCart();
  toast(`${name} added to your bag`);
}
$$(".quick-add, .add-cart-button").forEach(button => button.addEventListener("click", () => addToCart(button.dataset.product)));
$("#cartToggle").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartBackdrop").addEventListener("click", closeCart);
$("#cartItems").addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");
  if (qtyButton) {
    const name = qtyButton.dataset.name;
    cart[name] = (cart[name] || 0) + Number(qtyButton.dataset.qty);
    if (cart[name] <= 0) delete cart[name];
    renderCart();
  }
  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    renderCart();
  }
});
$("#checkoutButton").addEventListener("click", () => {
  if (!Object.keys(cart).length) {
    toast("Your bag is empty — add a fragrance first.");
    return;
  }
  const order = Object.entries(cart).map(([name, qty]) => `${name} × ${qty}`).join("\n");
  const total = Object.entries(cart).reduce((sum, [name, qty]) => sum + products[name].price * qty, 0);
  const message = `Hello AL-NOOR-FRAGRANCES! I'd like to place an order:\n${order}\nSubtotal: ${money(total)}\nPlease confirm delivery and payment options.`;
  // Demo checkout opens WhatsApp. Replace this number with your real business number.
  window.open(`https://wa.me/923043833274?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$$(".main-nav a").forEach(link => link.addEventListener("click", () => $("#mainNav").classList.remove("open")));
$("#searchToggle").addEventListener("click", () => {
  const panel = $("#searchPanel");
  panel.hidden = !panel.hidden;
  if (!panel.hidden) $("#searchInput").focus();
});
function filterProducts(query) {
  let visible = 0;
  $$(".product-card").forEach(card => {
    const matches = `${card.dataset.name} ${card.dataset.category}`.toLowerCase().includes(query.toLowerCase()) || !query;
    card.hidden = !matches;
    if (matches) visible++;
  });
  $("#emptyState").hidden = visible > 0;
}
$("#searchButton").addEventListener("click", () => filterProducts($("#searchInput").value.trim()));
$("#searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") filterProducts(event.target.value.trim());
});
$("#searchInput").addEventListener("input", event => filterProducts(event.target.value.trim()));
$$(".category").forEach(link => link.addEventListener("click", () => {
  const category = link.dataset.filter;
  $$(".product-card").forEach(card => {
    card.hidden = category !== "all" && card.dataset.category !== category;
  });
  $("#emptyState").hidden = $$(".product-card:not([hidden])").length > 0;
}));
$("#clearFilter").addEventListener("click", event => {
  event.preventDefault();
  $("#searchInput").value = "";
  filterProducts("");
});
$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = $("#newsletterEmail").value.trim();
  if (!email) return;
  $("#newsletterMessage").textContent = "Thanks for your interest! Connect an email marketing service to save subscriptions.";
  $("#newsletterEmail").value = "";
  toast("Thank you for subscribing!");
});
const reviews = [
  ['S', 'Sana A.', '“A beautiful scent that lasts all day. The packaging feels so premium!”'],
  ['F', 'Fiza Ahmed', '“Elegant, unique, and exactly the kind of fragrance I was looking for.”'],
  ['M', 'Maryam K.', '“The perfect everyday perfume. I’ve already ordered another bottle.”'],
  ['A', 'Ayesha R.', '“A gorgeous gift and such a lovely unboxing experience.”']
];
let reviewOffset = 0;
function showReviews() {
  const chosen = [0, 1, 2].map(n => reviews[(reviewOffset + n) % reviews.length]);
  $("#reviewGrid").innerHTML = chosen.map(([initial, name, quote], i) => `
    <article class="review"><div class="reviewer"><span class="avatar ${i === 1 ? "avatar-two" : i === 2 ? "avatar-three" : ""}">${initial}</span>
    <div><strong>${name}</strong><small>Demo review</small></div></div><p>${quote}</p><span class="stars">★★★★★</span></article>`).join("");
}
$("#reviewPrev").addEventListener("click", () => { reviewOffset = (reviewOffset + reviews.length - 1) % reviews.length; showReviews(); });
$("#reviewNext").addEventListener("click", () => { reviewOffset = (reviewOffset + 1) % reviews.length; showReviews(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
renderCart();
