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
  gap: 12px;
  flex-wrap: wrap;
}
.label {
  font-weight: 600;
}
select {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
}
select:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #c7d2fe;
}
</style>
