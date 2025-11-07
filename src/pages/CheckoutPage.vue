<template>
  <section class="checkout">
    <header class="page-head">
      <h1>Checkout</h1>
      <button class="ghost" @click="$emit('back')">← Continue shopping</button>
    </header>

    <div class="grid">
      <!-- CART SUMMARY -->
      <aside class="card">
        <h2 class="card-title">Your Cart</h2>

        <div v-if="!groupedItems.length" class="muted">Your cart is empty.</div>

        <ul v-else class="cart-list">
          <li v-for="g in groupedItems" :key="g._id" class="cart-row">
            <div class="info">
              <div class="name">{{ g.subject }}</div>
              <div class="meta">
                {{ g.location }} ·
                <span class="price">{{ asGBP(g.price) }}</span>
              </div>
            </div>

            <div class="qty">x{{ g.qty }}</div>
            <div class="row-total">{{ asGBP(g.total) }}</div>

            <!-- remove ONE unit -->
            <button class="link danger" @click="store.removeFromCart(g._id)">
              Remove
            </button>
          </li>
        </ul>

        <div class="totals" v-if="groupedItems.length">
          <div class="row">
            <span>Subtotal</span>
            <span>{{ asGBP(subtotal) }}</span>
          </div>
          <div class="row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="row grand">
            <span>Total</span>
            <span>{{ asGBP(subtotal) }}</span>
          </div>
        </div>
      </aside>

      <!-- DETAILS / PLACE ORDER -->
      <article class="card">
        <h2 class="card-title">Your details</h2>

        <div class="form">
          <label>
            <span>Name</span>
            <input
              v-model.trim="name"
              type="text"
              placeholder="Your full name"
              @input="validate"
            />
            <small v-if="name && !nameOk" class="hint">
              Letters only (min 2).
            </small>
          </label>

          <label>
            <span>Phone</span>
            <input
              v-model.trim="phone"
              type="tel"
              placeholder="07..."
              @input="validate"
            />
            <small v-if="phone && !phoneOk" class="hint">
              Digits only (7–15 numbers).
            </small>
          </label>

          <button
            class="primary"
            :disabled="!isValid || !cartItems.length || loading"
            @click="placeOrder"
          >
            {{ loading ? "Placing order..." : "Place order" }}
          </button>

          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">Order placed! Thank you 🎉</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "../composables/useStore";

const store = useStore();

const loading = ref(false);
const error = ref("");
const success = ref(false);

// flat cart (each item is one unit)
const cartItems = computed(() => store.state.cart || []);

// GROUPED VIEW for the UI
const groupedItems = computed(() => { 
  const map = new Map();
  for (const i of cartItems.value) {
    if (!map.has(i._id)) {
      map.set(i._id, {
        _id: i._id,
        subject: i.subject,
        location: i.location,
        price: Number(i.price) || 0,
        qty: 0,
      });
    }
    map.get(i._id).qty += 1;
  }
  return Array.from(map.values()).map((g) => ({
    ...g,
    total: g.qty * g.price,
  }));
});

// totals from the flat cart (already correct)
const subtotal = computed(() =>
  cartItems.value.reduce((sum, i) => sum + Number(i.price || 0), 0)
);

const name = ref("");
const phone = ref("");

// validation
const nameOk = computed(() =>
  /^[A-Za-z][A-Za-z\s'-]{1,}$/.test(name.value.trim())
);
const phoneOk = computed(() => /^\d{7,15}$/.test(phone.value.trim()));
const isValid = computed(() => nameOk.value && phoneOk.value);

function validate() {
  error.value = "";
  success.value = false;
}

function asGBP(v) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(v || 0);
}

async function placeOrder() {
  if (!isValid.value || !cartItems.value.length) return;

  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    // remove every item from flat cart (restores spaces for each)
    const ids = cartItems.value.map((i) => i._id);
    ids.forEach((id) => store.removeFromCart(id));

    success.value = true;
    name.value = "";
    phone.value = "";
  } catch (e) {
    error.value = e?.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.checkout {
  max-width: 1150px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
}
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.page-head h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
}
.ghost {
  border: 1px solid var(--border, #e5e7eb);
  background: #fff;
  border-radius: 10px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
}
.ghost:hover {
  background: #f5f7fb;
}

.grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1rem;
}
@media (max-width: 950px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #fff;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}
.card-title {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.cart-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  background: #fff;
}
.cart-row .info .name {
  font-weight: 700;
}
.meta {
  color: #6b7280;
}
.price {
  font-weight: 600;
}
.qty {
  text-align: right;
  width: 4ch;
}
.row-total {
  font-weight: 700;
  text-align: right;
}

.link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
}
.link.danger {
  color: #ef4444;
}

.totals {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}
.totals .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.totals .grand span:last-child {
  font-size: 1.15rem;
  font-weight: 800;
}

.form {
  display: grid;
  gap: 10px;
}
label {
  display: grid;
  gap: 6px;
}
input {
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  background: #fff;
}
button.primary {
  border: none;
  background: var(--primary, #2563eb);
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}
button.primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
button.primary:hover {
  filter: brightness(0.95);
}

.muted {
  color: #6b7280;
}
.error {
  color: #ef4444;
  margin-top: 0.5rem;
}
.success {
  color: #16a34a;
  margin-top: 0.5rem;
  font-weight: 700;
}
.hint {
  color: #ef4444;
  font-size: 0.85rem;
}
</style>
