<template>
  <main class="page">
    <div class="page-inner">
      <!-- HEADER / HERO PANEL -->
      <section class="hero-panel">
        <div class="hero-top-row">
          <div class="hero-title-area">
            <div class="hero-icon">
              <span class="hero-icon-glyph">📘</span>
            </div>
            <div>
              <h1 class="hero-title">After-School Classes</h1>
              <p class="hero-subtitle">
                Browse, sort, and book your next class.
              </p>
            </div>
          </div>

          <button
            class="hero-checkout"
            :class="{ 'hero-checkout--disabled': !cartHasItems }"
            :disabled="!cartHasItems"
            @click="goToCheckout"
          >
            <span class="hero-checkout-cart">🛒</span>
            <span>Checkout</span>
            <span v-if="cartCount" class="hero-checkout-badge">
              {{ cartCount }}
            </span>
          </button>
        </div>

        <!-- SEARCH -->
        <div class="hero-search-row">
          <input
            v-model="search"
            class="hero-search-input"
            type="search"
            placeholder="Search by subject, location, or price..."
            @input="handleSearchInput"
          />
        </div>

        <!-- SORTING -->
        <div class="hero-toolbar">
          <div class="toolbar-left">
            <span class="toolbar-label">Sort by:</span>

            <select
              v-model="localSortKey"
              class="toolbar-select"
              @change="updateSort"
            >
              <option value="price">Price</option>
              <option value="subject">Subject</option>
              <option value="location">Location</option>
              <option value="spaces">Spaces</option>
            </select>

            <select
              v-model="localSortDir"
              class="toolbar-select"
              @change="updateSort"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div class="toolbar-right">
            Showing <strong>{{ lessons.length }}</strong> classes
          </div>
        </div>
      </section>

      <!-- LESSON GRID -->
      <section v-if="!isLoading && !loadError" class="lessons-section">
        <div class="lessons-grid">
          <LessonCard
            v-for="lesson in lessons"
            :key="lesson._id"
            :lesson="lesson"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <p v-if="!lessons.length" class="empty-state">
          No classes match your search yet. Try a different term or sorting
          option.
        </p>
      </section>

      <!-- LOADING / ERROR STATES -->
      <section v-else-if="isLoading" class="state state--loading">
        Loading classes…
      </section>
      <section v-else class="state state--error">
        <p>Sorry, we couldn’t load the classes.</p>
        <button class="retry-btn" @click="reloadLessons">Try again</button>
      </section>
    </div>
  </main>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "../composables/useStore";
import LessonCard from "../components/LessonCard.vue";

export default {
  name: "LessonsPage",
  components: { LessonCard },
  emits: ["goToCheckout"],
  setup(props, { emit }) {
    const store = useStore();

    // local UI state mirroring the store
    const search = ref(store.state.search);
    const localSortKey = ref(store.state.sortKey || "price");
    const localSortDir = ref(store.state.sortDir || "asc");

    // computed from store
    const lessons = store.filteredLessons;
    const isLoading = computed(() => store.state.loadingLessons);
    const loadError = computed(() => store.state.lessonsError);

    const groupedCart = store.groupedCart;
    const cartCount = computed(() =>
      groupedCart.value.reduce((sum, item) => sum + item.qty, 0)
    );
    const cartHasItems = computed(() => cartCount.value > 0);

    function handleSearchInput() {
      store.setSearch(search.value);
    }

    function updateSort() {
      store.setSort({
        sortKey: localSortKey.value,
        sortDir: localSortDir.value,
      });
    }

    function handleAddToCart(lesson) {
      store.addToCart(lesson);
    }

    function reloadLessons() {
      store.loadLessons();
    }

    function goToCheckout() {
      emit("goToCheckout");
    }

    // initial load
    onMounted(() => {
      if (!store.state.lessons.length && !store.state.loadingLessons) {
        store.loadLessons();
      }
    });

    return {
      search,
      localSortKey,
      localSortDir,
      lessons,
      isLoading,
      loadError,
      cartCount,
      cartHasItems,
      handleSearchInput,
      updateSort,
      handleAddToCart,
      reloadLessons,
      goToCheckout,
    };
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  color: #e8ecff;
}

.page-inner {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* HERO PANEL */

.hero-panel {
  background: radial-gradient(circle at top left, #1b2346 0, #050818 60%);
  border-radius: 28px;
  padding: 24px 28px 24px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hero-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hero-title-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-icon {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  background: radial-gradient(circle at 30% 20%, #53b2ff, #2553ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 28px rgba(37, 83, 255, 0.8);
}

.hero-icon-glyph {
  font-size: 28px;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.hero-subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: rgba(232, 236, 255, 0.72);
}

.hero-checkout {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  background: radial-gradient(circle at 30% 0, #52ffb0, #11a653);
  color: #02110a;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 0 32px rgba(82, 255, 176, 0.7);
}

.hero-checkout--disabled {
  opacity: 0.5;
  cursor: default;
  box-shadow: none;
}

.hero-checkout-cart {
  font-size: 18px;
}

.hero-checkout-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(2, 17, 10, 0.85);
  color: #e8ecff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* search */

.hero-search-row {
  margin-top: 18px;
}

.hero-search-input {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 12px 16px;
  background: rgba(3, 8, 24, 0.95);
  color: #e8ecff;
  font-size: 14px;
}

.hero-search-input::placeholder {
  color: rgba(232, 236, 255, 0.5);
}

/* toolbar */

.hero-toolbar {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-label {
  color: rgba(232, 236, 255, 0.7);
}

.toolbar-select {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 6px 24px 6px 12px;
  background: rgba(5, 10, 30, 0.95);
  color: #e8ecff;
  font-size: 14px;
}

.toolbar-right {
  color: rgba(232, 236, 255, 0.7);
}

/* LESSONS GRID */

.lessons-section {
  margin-bottom: 40px;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.empty-state {
  margin-top: 16px;
  color: rgba(232, 236, 255, 0.7);
  font-size: 14px;
}

/* states */

.state {
  padding: 40px 0;
  text-align: center;
  color: rgba(232, 236, 255, 0.8);
}

.retry-btn {
  margin-top: 12px;
  border-radius: 999px;
  border: none;
  padding: 8px 18px;
  background: #3d46ff;
  color: #e8ecff;
  font-weight: 500;
  cursor: pointer;
}
</style>
