<template>
  <div class="poster-minimal" ref="posterRef">
    <!-- 白底 -->
    <div class="minimal-bg"></div>

    <!-- 用户图片 -->
    <div class="photo-area">
      <img :src="image" alt="" />
    </div>

    <!-- 几何分割线 -->
    <div class="geo-line"></div>

    <!-- 诗句 -->
    <div class="poem-section">
      <p class="poem-best-line">{{ poem.best_line }}</p>
      <p class="poem-source">——{{ poem.dynasty }}·{{ poem.author }}《{{ poem.title }}》</p>
    </div>

    <!-- 底部 -->
    <div class="poster-brand">
      <div class="brand-line"></div>
      <p>诗境 · PoeticLens</p>
      <p class="date-text">{{ dateStr }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  image: { type: String, required: true },
  poem: { type: Object, required: true },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
})

const posterRef = ref(null)

const dateStr = computed(() => {
  if (props.date) return props.date
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})

defineExpose({ posterRef })
</script>

<style scoped>
.poster-minimal {
  width: 375px;
  height: 667px;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  margin: 0 auto;
}

.minimal-bg {
  position: absolute;
  inset: 0;
  background: #ffffff;
}

.photo-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400px;
  overflow: hidden;
}

.photo-area img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(30%);
}

.geo-line {
  position: absolute;
  top: 396px;
  left: 32px;
  right: 32px;
  height: 1px;
  background: #000;
  opacity: 0.15;
}

.poem-section {
  position: absolute;
  top: 416px;
  left: 32px;
  right: 32px;
}

.poem-best-line {
  font-size: 22px;
  color: #000;
  letter-spacing: 0.1em;
  line-height: 1.8;
  font-weight: 300;
}

.poem-source {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
  letter-spacing: 0.05em;
}

.poster-brand {
  position: absolute;
  bottom: 20px;
  left: 32px;
  right: 32px;
  text-align: center;
}

.brand-line {
  width: 24px;
  height: 1px;
  background: #000;
  opacity: 0.2;
  margin: 0 auto 8px;
}

.poster-brand p {
  font-size: 11px;
  color: #bbb;
  letter-spacing: 0.05em;
}

.date-text {
  margin-top: 2px;
}
</style>
