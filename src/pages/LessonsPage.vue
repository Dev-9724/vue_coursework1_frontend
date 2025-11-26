<!-- src/pages/LessonsPage.vue -->
<template>
  <section class="lessons-page">
    <!-- PAGE HEADER -->
    <header class="page-head">
      <div class="page-head-main">
        <h1>After-School Lessons</h1>
        <p class="muted">
          Browse, search and sort lessons, then add them to your basket.
        </p>
      </div>

      <!-- SEARCH + SORT CONTROLS -->
      <div class="page-head-controls">
        <!-- SEARCH BAR -->
        <input
          v-model="search"
          type="search"
          class="search-input"
          placeholder="Search by subject or location…"
        />

        <!-- EXISTING SORT BAR (still using store.sortKey / sortDir) -->
        <SortBar
          :sort-key="state.sortKey"
          :sort-dir="state.sortDir"
          @change="setSort"
        />
      </div>
    </header>

    <!-- PAGE BODY -->
    <main>
      <!-- LOADING / ERROR STATES -->
      <div v-if="state.loadingLessons" class="muted">Loading lessons…</div>

      <div v-else-if="state.lessonsError" class="error">
        {{ state.lessonsError }}
      </div>

      <!-- NO RESULTS FOR CURRENT SEARCH -->
      <div
        v-else-if="!filteredLessons.length && state.lessons.length"
        class="muted"
      >
        No lessons match “{{ search }}”.
      </div>

      <!-- NO LESSONS AT ALL -->
      <div
        v-else-if="!filteredLessons.length && !state.lessons.length"
        class="muted"
      >
        There are currently no lessons available.
      </div>

      <!-- LESSON GRID -->
      <div v-else class="lessons-grid">
        <LessonCard
          v-for="lesson in filteredLessons"
          :key="lesson._id"
          :lesson="lesson"
          :in-cart-qty="qtyInCart(lesson._id)"
        />
      </div>
    </main>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "../composables/useStore";
import SortBar from "../components/SortBar.vue";
import LessonCard from "../components/LessonCard.vue";

const { state, sortedLessons, loadLessons, setSort, qtyInCart } = useStore();

// local search text (does NOT change your store)
const search = ref("");

// filter over the already-sorted lessons
const filteredLessons = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return sortedLessons.value;

  return sortedLessons.value.filter((lesson) => {
    const subject = String(lesson.subject || "").toLowerCase();
    const location = String(lesson.location || "").toLowerCase();
    return subject.includes(term) || location.includes(term);
  });
});

// load from backend on first visit
onMounted(() => {
  if (!state.lessons.length && !state.loadingLessons) {
    loadLessons();
  }
});
</script>

<style scoped>
.lessons-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.page-head {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.page-head-main h1 {
  margin: 0;
}

.page-head-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-end;
}

.search-input {
  min-width: 220px;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.muted {
  color: #666;
  font-size: 0.9rem;
}

.error {
  color: #b00020;
  font-weight: 500;
}
</style>
