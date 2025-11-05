<template>
  <section>
    <h2>Lessons</h2>
    <div class="grid">
      <LessonCard v-for="ls in lessons" :key="ls._id" :lesson="ls" />
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import LessonCard from "../components/LessonCard.vue";

const lessons = ref([
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
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
</style>
