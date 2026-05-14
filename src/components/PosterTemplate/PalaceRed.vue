<template>
  <div class="poster-palace-red" ref="posterRef">
    <!-- 红色底色 -->
    <div class="palace-bg"></div>

    <!-- 云纹装饰 -->
    <div class="cloud-ornament top-left"></div>
    <div class="cloud-ornament top-right"></div>
    <div class="cloud-ornament bottom-left"></div>
    <div class="cloud-ornament bottom-right"></div>

    <!-- 用户图片 -->
    <div class="photo-area">
      <img :src="image" alt="" />
    </div>

    <!-- 诗句区域 -->
    <div class="poem-section">
      <h3 class="poem-title">{{ poem.title }}</h3>
      <p class="poem-author">{{ poem.dynasty }}·{{ poem.author }}</p>
      <div class="poem-divider"></div>
      <p class="poem-best-line">「{{ poem.best_line }}」</p>
    </div>

    <!-- 底部品牌 -->
    <div class="poster-brand">
      <p>诗境·PoeticLens</p>
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
.poster-palace-red {
  width: 375px;
  height: 667px;
  position: relative;
  overflow: hidden;
  background: #8b0000;
  margin: 0 auto;
}

.palace-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #a01010 0%, #8b0000 70%);
}

.cloud-ornament {
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0.15;
}

.cloud-ornament::before,
.cloud-ornament::after {
  content: '';
  position: absolute;
  background: #d4af37;
  border-radius: 50%;
}

.cloud-ornament::before {
  width: 30px;
  height: 20px;
  top: 15px;
  left: 10px;
}

.cloud-ornament::after {
  width: 40px;
  height: 25px;
  top: 5px;
  left: 15px;
}

.top-left { top: 10px; left: 10px; }
.top-right { top: 10px; right: 10px; transform: scaleX(-1); }
.bottom-left { bottom: 80px; left: 10px; transform: scaleY(-1); }
.bottom-right { bottom: 80px; right: 10px; transform: scale(-1); }

.photo-area {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 295px;
  height: 320px;
  border: 3px solid #d4af37;
  border-radius: 4px;
  overflow: hidden;
}

.photo-area img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poem-section {
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0 24px;
}

.poem-title {
  font-size: 20px;
  color: #d4af37;
  font-weight: bold;
  letter-spacing: 0.1em;
}

.poem-author {
  font-size: 13px;
  color: rgba(212, 175, 55, 0.7);
  margin-top: 4px;
}

.poem-divider {
  width: 40px;
  height: 1px;
  background: #d4af37;
  margin: 12px auto;
  opacity: 0.5;
}

.poem-best-line {
  font-size: 22px;
  color: #d4af37;
  letter-spacing: 0.15em;
  line-height: 1.8;
}

.poster-brand {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  text-align: center;
}

.poster-brand p {
  font-size: 11px;
  color: rgba(212, 175, 55, 0.5);
}

.date-text {
  margin-top: 2px;
}
</style>
