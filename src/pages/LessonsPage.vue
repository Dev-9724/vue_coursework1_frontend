<template>
  <section>
    <h2>Lessons</h2>
    <SortBar :sortKey="sortKey" :sortDir="sortDir" @update:sort="onSort" />
    <div class="grid">
      <!-- use 'sorted', not 'lessons' -->
      <LessonCard v-for="ls in sorted" :key="ls._id" :lesson="ls" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import LessonCard from "../components/LessonCard.vue";
import SortBar from "../components/SortBar.vue";

const data = ref([
  {
    _id: "1",
    subject: "Art & Crafts",
    location: "Golders Green",
    price: 10.0,
    spaces: 9,
    rating: 3,
    image: "https://picsum.photos/id/1015/800/500",
  },
  {
    _id: "2",
    subject: "Maths — Young Learners",
    location: "Hendon",
    price: 12.5,
    spaces: 7,
    rating: 4,
    image: "https://picsum.photos/id/102/800/500",
  },
  {
    _id: "3",
    subject: "Coding Club",
    location: "Colindale",
    price: 18.0,
    spaces: 4,
    rating: 5,
    image: "https://picsum.photos/id/1005/800/500",
  },
]);

const sortKey = ref("subject");
const sortDir = ref("asc");

const sorted = computed(() => {
  const arr = [...data.value];
  arr.sort((a, b) => {
    const A = a[sortKey.value];
    const B = b[sortKey.value];
    if (typeof A === "number" && typeof B === "number") {
      return sortDir.value === "asc" ? A - B : B - A;
    }
    return sortDir.value === "asc"
      ? String(A).localeCompare(String(B))
      : String(B).localeCompare(String(A));
  });
  return arr;
});

function onSort({ sortKey: k, sortDir: d }) {
  sortKey.value = k;
  sortDir.value = d;
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
</style>
