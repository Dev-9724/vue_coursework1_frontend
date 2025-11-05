<template>
  <main class="container">
    <header class="topbar">
      <h1>Coursework App</h1>
      <nav>
        <button class="btn" @click="page = 'lessons'">Lessons</button>
      </nav>
    </header>

    <LessonsPage v-if="page === 'lessons'" />
  </main>
</template>

<script setup>
import { ref } from "vue";
import LessonsPage from "./pages/LessonsPage.vue";

const page = ref("lessons");
</script>

<style>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  font-family: system-ui, sans-serif;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
}
</style>
