<template>
  <div class="app-shell">
    <LessonsPage v-if="view === 'lessons'" @goToCheckout="goToCheckout" />
    <CheckoutPage v-else @back="view = 'lessons'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "./composables/useStore";
import LessonsPage from "./pages/LessonsPage.vue";
import CheckoutPage from "./pages/CheckoutPage.vue";

const view = ref("lessons");
const store = useStore();

function goToCheckout() {
  view.value = "checkout";
}

onMounted(() => {
  // load lessons once when app starts
  store.loadLessons();
});
</script>
