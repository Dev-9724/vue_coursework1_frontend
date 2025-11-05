<template>
  <div class="app">
    <main class="container">
      <LessonsPage v-if="page === 'lessons'" @checkout="page = 'checkout'" />
      <CheckoutPage v-else @back="page = 'lessons'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LessonsPage from "./pages/LessonsPage.vue";
import CheckoutPage from "./pages/CheckoutPage.vue";

const page = ref("lessons");
</script>

<style>
:root {
  --bg: #f5f7fb;
  --text: #0f172a;
  --border: #e5e7eb;
  --muted: #6b7280;
  --primary: #4f46e5;
}

* {
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    Arial, "Apple Color Emoji", "Segoe UI Emoji";
  color: var(--text);
  background: var(--bg);
}
.container {
  max-width: 1150px;
  margin: 0 auto;
  padding: 24px;
}

/* shared controls look */
button,
select {
  font: inherit;
}
select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
}
button.primary {
  border: none;
  background: var(--primary);
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}
button.primary:hover {
  filter: brightness(0.95);
}
button.icon {
  position: relative;
  border: 1px solid var(--border);
  background: #fff;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
}
button.icon:hover {
  background: #eef2ff;
}
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #111;
  color: #fff;
  border-radius: 999px;
  padding: 2px 7px;
  font-size: 12px;
}

/* focus ring for a11y */
select:focus-visible,
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #c7d2fe;
}
</style>
