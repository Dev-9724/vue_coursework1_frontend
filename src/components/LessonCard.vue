<template>
  <article class="card">
    <img class="card-img" :src="lesson.image" :alt="lesson.subject" />
    <div class="card-body">
      <div class="row">
        <h3 class="title">{{ lesson.subject }}</h3>
        <span class="spaces">Spaces: {{ lesson.spaces }}</span>
      </div>

      <p class="location">{{ lesson.location }}</p>
      <p class="price">£{{ lesson.price.toFixed(2) }}</p>

      <div class="stars">
        <span
          v-for="n in 5"
          :key="n"
          class="star"
          :class="{ on: n <= lesson.rating }"
          >★</span
        >
      </div>

      <!-- Live stock update -->
      <p
        class="stock"
        :class="{ low: lesson.spaces <= 2, out: lesson.spaces <= 0 }"
      >
        <span v-if="lesson.spaces > 0">
          {{ lesson.spaces }}
          {{ lesson.spaces === 1 ? "space" : "spaces" }} available
        </span>
        <span v-else>Fully booked</span>
      </p>

      <button
        class="btn"
        @click="$emit('add', lesson)"
        :disabled="lesson.spaces <= 0"
      >
        {{ lesson.spaces <= 0 ? "Full" : "Buy now!" }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "../composables/useStore.js";

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const inCart = computed(() => store.qtyInCart(props.lesson._id));
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}
.card-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}
.card-body {
  padding: 14px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.title {
  margin: 0 0 2px;
  font-size: 20px;
  font-weight: 800;
}
.location {
  margin: 0;
  color: var(--muted);
}
.price {
  margin: 10px 0 4px;
  font-weight: 800;
}
.stars {
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
}
.star {
  font-size: 18px;
  color: #d1d5db;
}
.star.on {
  color: #f59e0b;
}
.cta {
  margin: 0 0 10px;
  color: var(--muted);
}
.incart {
  color: var(--muted);
  font-size: 14px;
}
.actions {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
}
.btn {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}
.btn:hover {
  background: #f5f7fb;
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.stock {
  margin: 6px 0 12px;
  color: #10b981;
  font-weight: 600;
}
.stock.low {
  color: #f59e0b;
}
.stock.out {
  color: #ef4444;
}
</style>
