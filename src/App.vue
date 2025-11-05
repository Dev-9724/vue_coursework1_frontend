<template>
  <main class="container">
    <header class="topbar">
      <h1>Coursework App</h1>
      <nav class="nav">
        <button class="btn" @click="page = 'lessons'">Lessons</button>
        <button class="btn" @click="page = 'checkout'">
          Checkout
          <span v-if="state.cart.length" class="badge">{{
            state.cart.length
          }}</span>
        </button>
      </nav>
    </header>

    <section v-if="page === 'lessons'">
      <LessonsPage />
    </section>

    <CheckoutPage
      v-else
      :items="state.cart"
      :total="cartTotal"
      @remove="removeFromCart"
    />
  </main>
</template>

<script setup>
import { ref } from "vue";
import LessonsPage from "./pages/LessonsPage.vue";
import CheckoutPage from "./pages/CheckoutPage.vue";
import { useStore } from "./composables/useStore";

const page = ref("lessons");
const { state, cartTotal, removeFromCart } = useStore();
</script>

<style>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  font-family: system-ui, sans-serif;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
}
.nav {
  display: flex;
  gap: 8px;
}
.badge {
  background: #111;
  color: #fff;
  padding: 2px 8px;
  border-radius: 999px;
  margin-left: 6px;
  font-size: 12px;
}
</style>
