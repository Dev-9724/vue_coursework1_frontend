<template>
  <article class="card">
    <img class="card-img" :src="lesson.image" :alt="lesson.subject" />
    <div class="card-body">
      <div class="row">
        <h3 class="title">{{ lesson.subject }}</h3>
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

      <p
        class="stock"
        :class="{ low: lesson.spaces <= 2, out: lesson.spaces <= 0 }"
      >
        <span v-if="lesson.spaces > 0"> Spaces left: {{ lesson.spaces }} </span>
        <span v-else>Fully booked</span>
      </p>

      <button
        class="btn"
        @click="$emit('add', lesson)"
        :disabled="lesson.spaces <= 0"
      >
        {{ lesson.spaces <= 0 ? "Full" : "Add to Basket" }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
const emit = defineEmits(["add"]);
const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card {
  --border: var(--card-border);
  --muted: var(--text-muted);
  background: #fff;
  border: 1px solid var(--card-border);
  border-radius: 12px; /* Modern radius */
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Softer shadow */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px); /* A bit more lift on hover */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.card-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}
.card-body {
  padding: 16px; /* Slightly more padding */
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.title {
  margin: 0 0 2px;
  font-size: 1.25rem; /* Reduced and more modern size */
  font-weight: 800;
  color: var(--text-dark);
}
.location {
  margin: 0;
  font-size: 0.9rem; /* Smaller text */
  color: var(--text-muted);
}
.price {
  margin: 12px 0 6px;
  font-size: 1.15rem; /* Prominent price */
  font-weight: 800;
  color: var(--primary-blue); /* Highlight the price */
}

/* Stock styles */
.stock {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 6px;
  margin-bottom: 12px;
}
.stock.low {
  color: #f59e0b; /* Amber/yellow for low stock */
}
.stock.out {
  color: #ef4444; /* Red for out of stock */
}

/* Primary Button Styling */
.btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  font-weight: 700;
  font-size: 1rem;
  background: var(--primary-blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn:hover:not(:disabled) {
  background: var(--primary-hover);
}
.btn:disabled {
  background: var(--card-border);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Star Rating */
.stars {
  display: flex;
  gap: 2px;
  font-size: 1.2rem;
  color: var(--card-border); /* Grey out the stars by default */
}
.star.on {
  color: #f59e0b; /* Gold/amber for filled stars */
}
</style>
