<template>
  <main class="container">
    <LessonsPage v-if="page === 'lessons'" @checkout="page = 'checkout'" />

    <CheckoutPage
      v-else
      :items="state.cart"
      :total="cartTotal"
      @remove="removeFromCart"
      @back="page = 'lessons'"
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
/* Define CSS Variables for a consistent theme */
:root {
  --primary-blue: #2563eb; /* A bright, energetic blue */
  --primary-hover: #1d4ed8;
  --text-dark: #1f2937; /* Dark charcoal for text */
  --text-muted: #6b7280; /* Medium grey for muted text */
  --background-light: #f9fafb; /* Off-white background */
  --card-border: #e5e7eb;
}

.container {
  max-width: 1150px;
  margin: 0 auto;
  padding: 32px 24px; /* Increased top/bottom padding */
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, sans-serif;
  background: var(--background-light);
  min-height: 100dvh;
  color: var(--text-dark); /* Apply dark text color globally */
}

/* Base button style (for ghost and link buttons) */
.ghost {
  color: var(--primary-blue);
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}
.ghost:hover {
  background: rgba(37, 99, 235, 0.1);
}

/* Adjusting H1 size */
h1 {
  font-size: 2.2rem; /* Reduced from default large size */
  font-weight: 800;
  margin: 0;
}
</style>
