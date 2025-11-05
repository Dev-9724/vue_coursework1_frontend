<template>
  <main class="container">
    <!-- Lessons page -->
    <LessonsPage v-if="page === 'lessons'" @checkout="page = 'checkout'" />

    <!-- Checkout page -->
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
  max-width: 1150px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, sans-serif;
  background: #f5f7fb;
  min-height: 100dvh;
}
</style>
