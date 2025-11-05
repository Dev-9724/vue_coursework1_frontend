<template>
  <article class="card">
    <img :src="lesson.image" :alt="lesson.subject" />
    <div class="content">
      <h3>{{ lesson.subject }}</h3>
      <p><strong>Location:</strong> {{ lesson.location }}</p>
      <p><strong>Price:</strong> £{{ lesson.price.toFixed(2) }}</p>
      <p><strong>Spaces:</strong> {{ lesson.spaces }}</p>
      <button
        class="add"
        @click="$emit('add', lesson)"
        :disabled="lesson.spaces <= 0"
      >
        Add to cart
      </button>
    </div>
  </article>
</template>

<script setup>
defineProps({ lesson: Object });
defineEmits(["add"]);
</script>

<style scoped>
.card {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
}
img {
  width: 160px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
}
.add {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #999;
  background: #f3f3f3;
  cursor: pointer;
}
.add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
