<template>
  <article class="lesson-card">
    <div class="lesson-media">
      <img class="lesson-image" :src="lesson.image" :alt="lesson.subject" />

      <span
        v-if="lesson.spaces === 0"
        class="lesson-badge lesson-badge--danger"
      >
        Fully booked
      </span>
      <span
        v-else-if="lesson.spaces <= 2"
        class="lesson-badge lesson-badge--warning"
      >
        Only {{ lesson.spaces }} left
      </span>
    </div>

    <div class="lesson-body">
      <header class="lesson-header">
        <h2 class="lesson-title">{{ lesson.subject }}</h2>
        <p class="lesson-location">{{ lesson.location }}</p>
      </header>

      <div class="lesson-meta">
        <div class="lesson-price">£{{ Number(lesson.price).toFixed(2) }}</div>

        <div class="lesson-rating">
          <span
            v-for="n in lesson.rating"
            :key="'f' + n"
            class="star star--filled"
          >
            ★
          </span>
          <span v-for="n in 5 - lesson.rating" :key="'e' + n" class="star">
            ★
          </span>
        </div>
      </div>

      <footer class="lesson-footer">
        <p
          class="lesson-spaces"
          :class="{ 'lesson-spaces--zero': lesson.spaces === 0 }"
        >
          <span v-if="lesson.spaces === 0">No spaces left</span>
          <span v-else-if="lesson.spaces === 1">Only 1 space left</span>
          <span v-else>Spaces left: {{ lesson.spaces }}</span>
        </p>

        <button
          class="btn-add"
          :disabled="lesson.spaces === 0"
          @click="$emit('add-to-cart', lesson)"
        >
          <span class="btn-add__icon">＋</span>
          <span>Add to cart</span>
        </button>
      </footer>
    </div>
  </article>
</template>

<script>
export default {
  name: "LessonCard",
  props: {
    lesson: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.lesson-card {
  background: radial-gradient(circle at top left, #121a33 0, #050815 70%);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.lesson-media {
  position: relative;
  overflow: hidden;
  max-height: 220px;
}

.lesson-image {
  width: 100%;
  display: block;
  object-fit: cover;
}

.lesson-badge {
  position: absolute;
  left: 16px;
  bottom: 16px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.lesson-badge--danger {
  background: #ff4b6b;
}

.lesson-badge--warning {
  background: #ffb347;
  color: #1b1305;
}

.lesson-body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.lesson-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lesson-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.lesson-location {
  margin: 0;
  font-size: 13px;
  color: rgba(232, 236, 255, 0.7);
}

.lesson-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.lesson-price {
  font-weight: 600;
  font-size: 16px;
}

.lesson-rating {
  font-size: 13px;
}

.star {
  color: rgba(255, 255, 255, 0.18);
}

.star--filled {
  color: #ffcb46;
}

.lesson-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.lesson-spaces {
  font-size: 13px;
  color: rgba(232, 236, 255, 0.8);
}

.lesson-spaces--zero {
  color: #ff708a;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: #3c46ff;
  color: #e8ecff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
