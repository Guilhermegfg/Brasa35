const menuItems = [
  {
    id: 1,
    name: "Brasa Clássico",
    category: "Hambúrgueres",
    price: 28.90,
    tag: "clássico",
    description: "Pão brioche, smash 160g, cheddar, cebola roxa, picles e molho da casa.",
    image: "https://images.unsplash.com/photo-1590742309630-e9f9b66da3f7?auto=format&fit=crop&w=1000&q=82",
    extras: true
  },
  {
    id: 2,
    name: "Brasa Bacon",
    category: "Hambúrgueres",
    price: 34.90,
    tag: "mais pedido",
    description: "Smash 160g, cheddar duplo, bacon crocante, cebola caramelizada e barbecue.",
    image: "https://i.pinimg.com/originals/20/fe/f4/20fef425655c6fe95592a0e011d799b7.jpg",
    extras: true
  },
  {
    id: 3,
    name: "Brasa Duplo",
    category: "Hambúrgueres",
    price: 39.90,
    tag: "fome alta",
    description: "Dois smash de 120g, queijo prato, cheddar, picles e molho 35.",
    image: "https://iggbsjqnlcvkzvxjmfok.supabase.co/storage/v1/object/public/images/prompts/juicy-burger-close-up-prompt-1775856356160.webp",
    extras: true
  },
  {
    id: 4,
    name: "Combo 35",
    category: "Combos",
    price: 44.90,
    tag: "combo",
    description: "Brasa Clássico + fritas crocantes + refrigerante lata.",
    image: "https://images.unsplash.com/photo-1590742309630-e9f9b66da3f7?auto=format&fit=crop&w=1100&q=80",
    extras: true
  },
  {
    id: 5,
    name: "Combo Bacon",
    category: "Combos",
    price: 49.90,
    tag: "combo",
    description: "Brasa Bacon + fritas + refrigerante lata. Sem espaço para arrependimento.",
    image: "https://i.pinimg.com/originals/20/fe/f4/20fef425655c6fe95592a0e011d799b7.jpg",
    extras: true
  },
  {
    id: 6,
    name: "Fritas da Casa",
    category: "Porções",
    price: 18.90,
    tag: "crocante",
    description: "Batatas sequinhas com páprica defumada e molho especial.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80",
    extras: false
  },
  {
    id: 7,
    name: "Fritas Cheddar & Bacon",
    category: "Porções",
    price: 27.90,
    tag: "pra dividir",
    description: "Fritas, cheddar cremoso, bacon crocante e cebolinha.",
    image: "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?auto=format&fit=crop&w=1000&q=80",
    extras: false
  },
  {
    id: 8,
    name: "Coca-Cola",
    category: "Bebidas",
    price: 7.00,
    tag: "350 ml",
    description: "Lata gelada para acompanhar o pedido.",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1000&q=80",
    extras: false
  },
  {
    id: 9,
    name: "Guaraná",
    category: "Bebidas",
    price: 6.50,
    tag: "350 ml",
    description: "Lata gelada.",
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=1000&q=80",
    extras: false
  },
  {
    id: 10,
    name: "Brownie Brasa",
    category: "Sobremesas",
    price: 16.90,
    tag: "doce final",
    description: "Brownie de chocolate com calda cremosa e toque de flor de sal.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80",
    extras: false
  }
];

const extraOptions = [
  { name: "Cheddar extra", price: 4.00 },
  { name: "Bacon extra", price: 5.00 },
  { name: "Carne extra", price: 9.00 },
  { name: "Cebola caramelizada", price: 3.00 },
  { name: "Molho da casa", price: 2.50 }
];

const state = {
  category: "Todos",
  search: "",
  cart: [],
  modalItem: null,
  modalQty: 1
};

const menuGrid = document.getElementById("menuGrid");
const categoryNav = document.getElementById("categoryNav");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const modalBackdrop = document.getElementById("modalBackdrop");
const productModal = document.getElementById("productModal");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const orderNote = document.getElementById("orderNote");

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const categories = ["Todos", ...new Set(menuItems.map(i => i.category))];

function renderCategories() {
  categoryNav.innerHTML = categories.map(cat =>
    `<button class="category-btn ${state.category === cat ? "active" : ""}" data-category="${cat}">${cat}</button>`
  ).join("");

  categoryNav.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      renderCategories();
      renderMenu();
    });
  });
}

function renderMenu() {
  const term = state.search.trim().toLowerCase();
  const filtered = menuItems.filter(item => {
    const matchesCategory = state.category === "Todos" || item.category === state.category;
    const matchesSearch = !term || [item.name, item.description, item.category].join(" ").toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  if (!filtered.length) {
    menuGrid.innerHTML = `<div class="no-results">Nenhum item encontrado. Tente outro termo.</div>`;
    return;
  }

  menuGrid.innerHTML = filtered.map(item => `
    <article class="menu-card">
      <div class="card-image" style="background-image:url('${item.image}')">
        <span class="card-tag">${item.tag}</span>
      </div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="card-bottom">
          <span class="price">${currency.format(item.price)}</span>
          <button class="add-btn" data-id="${item.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");

  menuGrid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => openProduct(Number(btn.dataset.id)));
  });
}

function openOverlay() {
  modalBackdrop.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closeOverlayIfNeeded() {
  if (!cartDrawer.classList.contains("open") && productModal.classList.contains("hidden")) {
    modalBackdrop.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }
}

function openProduct(id) {
  const item = menuItems.find(i => i.id === id);
  state.modalItem = item;
  state.modalQty = 1;

  document.getElementById("modalCategory").textContent = item.category;
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent = item.description;
  document.getElementById("modalImage").style.backgroundImage = `url('${item.image}')`;
  document.getElementById("qtyValue").textContent = "1";

  const extrasWrap = document.getElementById("extrasWrap");
  const extrasList = document.getElementById("extrasList");

  if (item.extras) {
    extrasWrap.classList.remove("hidden");
    extrasList.innerHTML = extraOptions.map((extra, index) => `
      <div class="extra-option">
        <label>
          <input type="checkbox" data-index="${index}">
          <span>${extra.name}</span>
        </label>
        <strong>+${currency.format(extra.price)}</strong>
      </div>
    `).join("");
  } else {
    extrasWrap.classList.add("hidden");
    extrasList.innerHTML = "";
  }

  updateModalPrice();
  productModal.classList.remove("hidden");
  openOverlay();
}

function closeProduct() {
  productModal.classList.add("hidden");
  state.modalItem = null;
  closeOverlayIfNeeded();
}

function selectedExtras() {
  return [...document.querySelectorAll("#extrasList input:checked")].map(input => extraOptions[Number(input.dataset.index)]);
}

function updateModalPrice() {
  if (!state.modalItem) return;
  const extrasTotal = selectedExtras().reduce((sum, e) => sum + e.price, 0);
  const total = (state.modalItem.price + extrasTotal) * state.modalQty;
  document.getElementById("modalPrice").textContent = currency.format(total);
}

function addModalToCart() {
  const extras = selectedExtras();
  const item = state.modalItem;
  if (!item) return;

  const key = `${item.id}-${extras.map(e => e.name).sort().join("|")}`;
  const existing = state.cart.find(ci => ci.key === key);

  if (existing) {
    existing.qty += state.modalQty;
  } else {
    state.cart.push({
      key,
      id: item.id,
      name: item.name,
      basePrice: item.price,
      extras,
      qty: state.modalQty
    });
  }

  renderCart();
  closeProduct();
  openCart();
}

function cartItemUnitPrice(item) {
  return item.basePrice + item.extras.reduce((sum, e) => sum + e.price, 0);
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = count;

  if (!state.cart.length) {
    cartItemsEl.innerHTML = `<div class="cart-empty">Seu carrinho ainda está vazio.<br>Escolha algo na brasa 🔥</div>`;
    cartTotalEl.textContent = currency.format(0);
    return;
  }

  cartItemsEl.innerHTML = state.cart.map((item, index) => {
    const extrasText = item.extras.length ? item.extras.map(e => e.name).join(", ") : "Sem adicionais";
    return `
      <div class="cart-item">
        <div>
          <h4>${item.qty}x ${item.name}</h4>
          <small>${extrasText}</small>
          <div class="cart-actions">
            <button data-action="minus" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button data-action="plus" data-index="${index}">+</button>
            <button class="remove-link" data-action="remove" data-index="${index}">remover</button>
          </div>
        </div>
        <div class="item-price">${currency.format(cartItemUnitPrice(item) * item.qty)}</div>
      </div>
    `;
  }).join("");

  cartItemsEl.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      const action = btn.dataset.action;
      if (action === "plus") state.cart[index].qty += 1;
      if (action === "minus") {
        state.cart[index].qty -= 1;
        if (state.cart[index].qty <= 0) state.cart.splice(index, 1);
      }
      if (action === "remove") state.cart.splice(index, 1);
      renderCart();
    });
  });

  const total = state.cart.reduce((sum, item) => sum + cartItemUnitPrice(item) * item.qty, 0);
  cartTotalEl.textContent = currency.format(total);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  openOverlay();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  setTimeout(closeOverlayIfNeeded, 260);
}

function checkoutWhatsapp() {
  if (!state.cart.length) {
    alert("Adicione pelo menos um item ao pedido.");
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + cartItemUnitPrice(item) * item.qty, 0);
  const lines = [
    "Olá! Quero fazer um pedido na BRASA 35 🔥",
    "",
    ...state.cart.flatMap(item => {
      const itemTotal = cartItemUnitPrice(item) * item.qty;
      const extras = item.extras.length ? `\n   Adicionais: ${item.extras.map(e => e.name).join(", ")}` : "";
      return [`• ${item.qty}x ${item.name} — ${currency.format(itemTotal)}${extras}`];
    }),
    "",
    `*Total: ${currency.format(total)}*`,
    orderNote.value.trim() ? `\nObservações: ${orderNote.value.trim()}` : "",
    "",
    "Pode confirmar disponibilidade e prazo, por favor?"
  ];

  const message = encodeURIComponent(lines.filter(Boolean).join("\n"));
  window.open(`https://wa.me/5562998230185?text=${message}`, "_blank");
}

searchInput.addEventListener("input", e => {
  state.search = e.target.value;
  renderMenu();
});

document.getElementById("cartTrigger").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("closeModal").addEventListener("click", closeProduct);
document.getElementById("checkoutBtn").addEventListener("click", checkoutWhatsapp);
modalBackdrop.addEventListener("click", () => {
  closeProduct();
  closeCart();
});

document.getElementById("qtyMinus").addEventListener("click", () => {
  state.modalQty = Math.max(1, state.modalQty - 1);
  document.getElementById("qtyValue").textContent = state.modalQty;
  updateModalPrice();
});
document.getElementById("qtyPlus").addEventListener("click", () => {
  state.modalQty += 1;
  document.getElementById("qtyValue").textContent = state.modalQty;
  updateModalPrice();
});
document.getElementById("extrasList").addEventListener("change", updateModalPrice);
document.getElementById("addToCartBtn").addEventListener("click", addModalToCart);

renderCategories();
renderMenu();
renderCart();
