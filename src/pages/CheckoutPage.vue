<template>
  <div class="checkout-shell">
    <section class="checkout-card">
      <!-- Header -->
      <header class="checkout-header">
        <div class="header-left">
          <div class="header-icon">
            <span>📋</span>
          </div>
          <div>
            <h1 class="header-title">Checkout</h1>
            <p class="header-subtitle">
              Review your booking and enter your details.
            </p>
          </div>
        </div>

        <button class="back-btn" @click="emit('back')">
          ← Back to classes
        </button>
      </header>

      <!-- Main content -->
      <div class="checkout-grid">
        <!-- Cart panel -->
        <section class="panel">
          <h2 class="panel-title">Your Cart</h2>

          <p v-if="!groupedCart.length" class="empty-cart">
            Your cart is empty.
          </p>

          <ul v-else class="cart-list">
            <li v-for="item in groupedCart" :key="item._id" class="cart-row">
              <!-- left: lesson info -->
              <div class="cart-info">
                <div class="cart-subject">{{ item.subject }}</div>
                <div class="cart-meta">
                  <span>{{ item.location }}</span>
                  <span>·</span>
                  <span>{{ asGBP(item.price) }}</span>
                </div>
              </div>

              <!-- middle: qty controls -->
              <div class="cart-qty">
                <div class="qty-controls">
                  <button
                    class="qty-btn"
                    @click="decrement(item._id)"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span class="qty-num">{{ item.qty }}</span>
                  <button
                    class="qty-btn"
                    :disabled="lessonById(item._id)?.spaces === 0"
                    :title="
                      lessonById(item._id)?.spaces === 0
                        ? 'No more spaces'
                        : 'Increase quantity'
                    "
                    @click="increment(item._id)"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <small
                  class="spaces"
                  :class="{
                    'spaces--none': lessonById(item._id)?.spaces === 0,
                  }"
                >
                  <span v-if="lessonById(item._id)?.spaces === 0">
                    No spaces left
                  </span>
                  <span v-else>
                    Spaces left: {{ lessonById(item._id)?.spaces ?? 0 }}
                  </span>
                </small>
              </div>

              <!-- right: total + remove -->
              <div class="cart-right">
                <div class="cart-total">
                  {{ asGBP(item.total) }}
                </div>
                <button
                  class="remove-link"
                  type="button"
                  @click="removeLine(item._id, item.qty)"
                >
                  Remove
                </button>
              </div>
            </li>
          </ul>

          <div v-if="groupedCart.length" class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ asGBP(cartTotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="summary-row summary-row--grand">
              <span>Total</span>
              <span>{{ asGBP(cartTotal) }}</span>
            </div>
          </div>
        </section>

        <!-- Details panel -->
        <section class="panel">
          <h2 class="panel-title">Your Details</h2>

          <form class="details-form" @submit.prevent="handlePlaceOrder">
            <label class="field">
              <span>Name</span>
              <input
                v-model.trim="name"
                type="text"
                placeholder="Your full name"
                @input="resetMessages"
              />
              <small v-if="name && !nameOk" class="field-hint">
                Letters only (min 2).
              </small>
            </label>

            <label class="field">
              <span>Phone</span>
              <input
                v-model.trim="phone"
                type="tel"
                placeholder="e.g. 07123 456789"
                @input="resetMessages"
              />
              <small v-if="phone && !phoneOk" class="field-hint">
                Digits only, between 7 and 15.
              </small>
            </label>

            <p v-if="error" class="msg msg--error">{{ error }}</p>
            <p v-if="success" class="msg msg--success">
              Order placed! Thank you 🎉
            </p>

            <button
              class="primary-btn"
              type="submit"
              :disabled="loading || !isValid || !groupedCart.length"
            >
              <span v-if="loading">Placing order…</span>
              <span v-else>Place order</span>
            </button>
          </form>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "../composables/useStore";

const emit = defineEmits(["back"]);
const store = useStore();

// cart data from the store (already computed in the store)
const groupedCart = store.groupedCart;
const cartTotal = store.cartTotal;

const name = ref("");
const phone = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

// flat cart - used only for "is cart empty" in placeOrder
const cartItems = computed(() => store.state.cart || []);

// find lesson in full list (needed for remaining spaces)
const lessonById = (id) => store.state.lessons.find((l) => l._id === id);

// + button: add one unit if there are spaces
function increment(id) {
  const lesson = lessonById(id);
  if (lesson && lesson.spaces > 0) {
    store.addToCart(lesson);
  }
}

// - button: remove one unit
function decrement(id) {
  store.removeFromCart(id);
}

// "Remove" link: remove the whole line
function removeLine(id, qty) {
  for (let i = 0; i < qty; i++) {
    store.removeFromCart(id);
  }
}

// validation
const nameOk = computed(() =>
  /^[A-Za-z][A-Za-z\s'-]{1,}$/.test(name.value.trim())
);
const phoneOk = computed(() => /^\d{7,15}$/.test(phone.value.trim()));
const isValid = computed(() => nameOk.value && phoneOk.value);

function resetMessages() {
  error.value = "";
  success.value = false;
}

function asGBP(v) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(v || 0);
}

// submit the order using store.placeOrder
async function handlePlaceOrder() {
  if (!isValid.value || !cartItems.value.length) return;

  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await store.placeOrder({
      name: name.value,
      phone: phone.value,
    });

    success.value = true;
    name.value = "";
    phone.value = "";
  } catch (e) {
    console.error(e);
    error.value = e?.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.checkout-shell {
  min-height: 100vh;
  padding: 32px 24px 40px;
  display: flex;
  justify-content: center;
  background: radial-gradient(circle at top left, #1b2340, #050816);
  color: #f7f7ff;
  box-sizing: border-box;
}

.checkout-card {
  width: 100%;
  max-width: 1200px;
  background: radial-gradient(circle at top left, #172848, #050816);
  border-radius: 32px;
  padding: 28px 32px 32px;
  box-shadow: 0 32px 70px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  box-sizing: border-box;
}

/* header */

.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 0, #4e7fff, #2534ff);
  box-shadow: 0 0 40px rgba(80, 140, 255, 0.6);
}

.header-icon span {
  font-size: 28px;
}

.header-title {
  font-size: 26px;
  margin: 0;
}

.header-subtitle {
  margin: 2px 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.back-btn {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: transparent;
  padding: 8px 18px;
  font-size: 14px;
  color: #f7f7ff;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease,
    transform 0.12s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* layout */

.checkout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 20px;
}

.panel {
  background: rgba(5, 10, 25, 0.9);
  border-radius: 24px;
  padding: 20px 22px 22px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.02);
  box-sizing: border-box;
}

.panel-title {
  margin: 0 0 16px;
  font-size: 18px;
}

/* cart */

.empty-cart {
  padding: 24px 8px;
  font-size: 14px;
  opacity: 0.7;
}

.cart-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-row {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: radial-gradient(circle at top left, #10152a, #050816);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.cart-info {
  min-width: 0;
}

.cart-subject {
  font-weight: 600;
  margin-bottom: 4px;
}

.cart-meta {
  font-size: 13px;
  opacity: 0.8;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cart-qty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: rgba(80, 140, 255, 0.16);
  color: #f7f7ff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.qty-num {
  font-weight: 600;
}

.spaces {
  font-size: 11px;
  color: rgba(232, 236, 255, 0.8);
}

.spaces--none {
  color: #ff8b97;
}

.cart-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.cart-total {
  font-weight: 600;
}

.remove-link {
  border: none;
  padding: 0;
  background: none;
  color: #ff8b97;
  font-size: 12px;
  cursor: pointer;
}

/* summary */

.summary {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 2px 0;
}

.summary-row--grand {
  margin-top: 4px;
  font-weight: 600;
}

/* details form */

.details-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.field input {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(2, 6, 23, 0.9);
  padding: 9px 14px;
  font-size: 14px;
  color: #f7f7ff;
  outline: none;
  box-sizing: border-box;
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.field input:focus {
  border-color: rgba(124, 162, 255, 0.9);
  box-shadow: 0 0 0 1px rgba(124, 162, 255, 0.3);
}

.field-hint {
  font-size: 12px;
  color: #ff8b97;
}

.msg {
  font-size: 13px;
}

.msg--error {
  color: #ff8b97;
}

.msg--success {
  color: #7fffd4;
}

.primary-btn {
  margin-top: 4px;
  border-radius: 999px;
  border: none;
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #5258ff, #8540ff);
  color: #f7f7ff;
  cursor: pointer;
  box-shadow: 0 15px 35px rgba(82, 88, 255, 0.55);
  transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: default;
  box-shadow: none;
}

.primary-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 45px rgba(82, 88, 255, 0.75);
}

/* responsive */

@media (max-width: 900px) {
  .checkout-card {
    padding: 20px 18px 22px;
  }

  .checkout-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .checkout-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .back-btn {
    align-self: flex-end;
  }

  .cart-row {
    grid-template-columns: minmax(0, 1.4fr) auto;
    grid-auto-rows: auto;
    grid-template-areas:
      "info qty"
      "info right";
  }

  .cart-info {
    grid-area: info;
  }

  .cart-qty {
    grid-area: qty;
  }

  .cart-right {
    grid-area: right;
  }
}
</style>
