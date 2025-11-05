<template>
  <section>
    <h2>Lessons</h2>
    <SortBar
      :sortKey="state.sortKey"
      :sortDir="state.sortDir"
      @update:sort="setSort"
    />
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

const { state, sortedLessons, setSort, addToCart } = useStore();
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
</style>
