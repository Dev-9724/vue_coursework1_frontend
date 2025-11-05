<template>
  <section>
    <h2>Checkout</h2>
    <div v-if="items.length === 0">Your cart is empty.</div>
    <ul v-else class="cart">
      <li v-for="item in items" :key="item._id">
        <span>{{ item.subject }}</span>
        <span>£{{ item.price.toFixed(2) }}</span>
        <button class="btn" @click="$emit('remove', item._id)">Remove</button>
      </li>
    </ul>
    <p v-if="items.length">
      Total: <strong>£{{ total.toFixed(2) }}</strong>
    </p>
  </section>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
});
defineEmits(["remove"]);
</script>

<style scoped>
.cart {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 8px;
}
.cart li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 8px;
}
.btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
}
</style>
