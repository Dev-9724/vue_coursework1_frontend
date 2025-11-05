<template>
  <section class="lessons-page">
    <!-- header -->
    <header class="page-head">
      <h1>After-School Classes</h1>

      <div class="head-actions">
        <SortBar
          :sortKey="state.sortKey"
          :sortDir="state.sortDir"
          @update:sort="setSort"
        />

        <!-- cart button with badge -->
        <button class="icon" @click="$emit('checkout')" aria-label="Cart">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M7 4H5L3 7h2l3.5 7H18a2 2 0 0 0 1.8-1.1L23 7H7"
              fill="currentColor"
            />
          </svg>
          <span class="badge" v-if="state.cart.length">{{
            state.cart.length
          }}</span>
        </button>

        <button class="primary" @click="$emit('checkout')">Checkout</button>
      </div>
    </header>

    <!-- lessons grid -->
    <div class="grid">
      <LessonCard
        v-for="ls in sortedLessons"
        :key="ls._id"
        :lesson="ls"
        @add="addToCart"
      />
    </div>
  </section>
</template>

<script setup>
import LessonCard from "../components/LessonCard.vue";
import SortBar from "../components/SortBar.vue";
import { useStore } from "../composables/useStore";
const emit = defineEmits(["checkout"]);
const { state, sortedLessons, setSort, addToCart } = useStore();
</script>

<style scoped>
.lessons-page {
  padding: 1.25rem 1.5rem;
  max-width: 1150px;
  margin: 0 auto;
}
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.page-head h1 {
  margin: 0;
  font-size: 44px;
  line-height: 1.05;
  font-weight: 800;
}
.head-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.icon {
  position: relative;
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
}
.icon:hover {
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
.primary {
  border: none;
  background: #4f46e5;
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}
.primary:hover {
  filter: brightness(0.95);
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
</style>
