<template>
  <section class="lessons-page">
    <!-- header -->
    <header class="page-head">
      <h1>After-School Classes</h1>

      <div class="head-actions">
        <input
          v-model="state.search"
          class="search-input"
          type="search"
          placeholder="Search by subject or location…"
          aria-label="Search lessons"
        />

        <SortBar
          :sortKey="state.sortKey"
          :sortDir="state.sortDir"
          @update:sort="setSort"
        />

        <!-- cart button with badge -->
        <button class="icon" @click="emit('checkout')" aria-label="Cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            ></path>
          </svg>

          <span class="badge" v-if="state.cart.length">
            {{ state.cart.length }}
          </span>
        </button>

        <button class="primary" @click="$emit('checkout')">Checkout</button>
      </div>
    </header>

    <!-- lessons content -->
    <div v-if="state.loadingLessons" class="muted">Loading lessons...</div>

    <div v-else-if="state.lessonsError" class="error">
      {{ state.lessonsError }}
    </div>

    <div v-else class="grid">
      <LessonCard
        v-for="ls in filteredLessons"
        :key="ls._id"
        :lesson="ls"
        @add="addToCart"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import LessonCard from "../components/LessonCard.vue";
import SortBar from "../components/SortBar.vue";
import { useStore } from "../composables/useStore";

const emit = defineEmits(["checkout"]);

const { state, sortedLessons, filteredLessons, setSort, addToCart, loadLessons } = useStore();

onMounted(() => {
  loadLessons();
});
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
.search-input {
  min-width: 260px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(16,24,40,0.06);
  background: #fff;
}
@media (max-width: 900px) {
  .search-input { min-width: 160px; }
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
.muted {
  color: #6b7280;
  padding: 0.75rem 0;
}
.error {
  color: #b91c1c;
  padding: 0.75rem 0;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
</style>
