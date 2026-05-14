<template>
  <div class="poster-minimal" ref="posterRef">
    <!-- 白底 -->
    <div class="minimal-bg"></div>

    <!-- 用户图片 -->
    <div class="photo-area">
      <img :src="image" alt="" @load="onImageLoad" />
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

function onImageLoad(e) {
  // 图片加载完成后无需额外处理，CSS 自动按原比例展示
}

defineExpose({ posterRef })
</script>

<style scoped>
.poster-minimal {
  width: 375px;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.minimal-bg {
  position: absolute;
  inset: 0;
  background: #ffffff;
}

.photo-area {
  position: relative;
  width: 100%;
  flex-shrink: 0;
  z-index: 1;
}

.photo-area img {
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(30%);
}

.geo-line {
  position: relative;
  margin: 16px 32px;
  height: 1px;
  background: #000;
  opacity: 0.15;
  z-index: 1;
}

.poem-section {
  position: relative;
  padding: 0 32px;
  z-index: 1;
  flex-shrink: 0;
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
  position: relative;
  padding: 20px 32px;
  text-align: center;
  z-index: 1;
  flex-shrink: 0;
  margin-top: auto;
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
