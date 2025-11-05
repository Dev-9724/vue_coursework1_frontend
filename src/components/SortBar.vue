<template>
  <div class="sortbar">
    <label>
      Sort by:
      <select v-model="local.sortKey">
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="spaces">Spaces</option>
      </select>
    </label>

    <label>
      Order:
      <select v-model="local.sortDir">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </label>

    <button class="btn" @click="apply">Apply</button>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const emit = defineEmits(["update:sort"]);
const props = defineProps({
  sortKey: { type: String, default: "subject" },
  sortDir: { type: String, default: "asc" },
});

const local = reactive({ sortKey: props.sortKey, sortDir: props.sortDir });
function apply() {
  emit("update:sort", { sortKey: local.sortKey, sortDir: local.sortDir });
}
</script>

<style scoped>
.sortbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 12px 0;
}
.btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
}
select {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>
