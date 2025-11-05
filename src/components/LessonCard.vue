<template>
  <article class="card">
    <img :src="lesson.image" :alt="lesson.subject" />
    <div class="content">
      <h3>{{ lesson.subject }}</h3>
      <p><strong>Location:</strong> {{ lesson.location }}</p>
      <p><strong>Price:</strong> £{{ lesson.price.toFixed(2) }}</p>
      <p><strong>Spaces:</strong> {{ lesson.spaces }}</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
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
h3 {
  margin: 0 0 6px;
}
</style>
