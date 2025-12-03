<template>
  <div class="sortbar">
    <span class="label">Sort by:</span>

    <select v-model="local.localKey">
      <option value="subject">Subject</option>
      <option value="location">Location</option>
      <option value="price">Price</option>
      <option value="rating">Rating</option>
      <option value="spaces">Spaces</option>
    </select>

    <select v-model="local.localDir">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const emit = defineEmits(["update:sort"]);
const props = defineProps({
  sortKey: { type: String, default: "price" },
  sortDir: { type: String, default: "asc" },
});

const local = reactive({
  localKey: props.sortKey,
  localDir: props.sortDir,
});

watch(
  local,
  () => {
    emit("update:sort", { sortKey: local.localKey, sortDir: local.localDir });
  },
  { deep: true }
);
</script>

<style scoped>
.sortbar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}
.label {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500; /* Slightly reduced weight for the label text */
}
/* 2. Style the Dropdowns */
select {
  padding: 10px 10px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  cursor: pointer;
  appearance: none; /* Hide default dropdown arrow for cleaner look */
  /* Add custom caret icon via SVG data URI */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="gray" d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 30px; /* Make space for custom arrow */
}
</style>
