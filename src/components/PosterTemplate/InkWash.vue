<template>
  <div class="poster-ink-wash" ref="posterRef">
    <!-- 背景图 -->
    <div class="poster-bg">
      <img :src="image" alt="" />
      <div class="poster-overlay"></div>
    </div>

    <!-- 诗句竖排 -->
    <div class="poem-vertical">
      <p class="poem-line" v-for="(char, i) in bestLineChars" :key="i">{{ char }}</p>
    </div>

    <!-- 底部信息 -->
    <div class="poster-footer">
      <div class="seal">
        <span>诗</span>
      </div>
      <div class="poem-info">
        <p class="poem-title">{{ poem.title }}</p>
        <p class="poem-author">{{ poem.dynasty }}·{{ poem.author }}</p>
      </div>
      <div class="brand-mark">
        <p>诗境·PoeticLens</p>
        <p class="date-text">{{ dateStr }}</p>
      </div>
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

const bestLineChars = computed(() => {
  return props.poem.best_line?.split('') || []
})

const dateStr = computed(() => {
  if (props.date) return props.date
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})

defineExpose({ posterRef })
</script>

<style scoped>
.poster-ink-wash {
  width: 375px;
  height: 667px;
  position: relative;
  overflow: hidden;
  background: #f5f0e8;
  margin: 0 auto;
}

.poster-bg {
  position: absolute;
  inset: 0;
}

.poster-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(245, 240, 232, 0.3) 0%, rgba(245, 240, 232, 0.7) 100%);
}

.poem-vertical {
  position: absolute;
  top: 60px;
  right: 40px;
  display: flex;
  flex-direction: row-reverse;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.2em;
  font-size: 24px;
  color: #2c2c2c;
  font-family: 'LXGW WenKai', serif;
  text-shadow: 0 0 8px rgba(245, 240, 232, 0.8);
  line-height: 1.5;
}

.poem-line {
  margin: 0;
}

.poster-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: rgba(245, 240, 232, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 12px;
}

.seal {
  width: 48px;
  height: 48px;
  border: 2px solid #a83c3c;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a83c3c;
  font-size: 20px;
  font-weight: bold;
  opacity: 0.9;
  flex-shrink: 0;
}

.poem-info {
  flex: 1;
}

.poem-title {
  font-size: 16px;
  color: #2c2c2c;
  font-weight: bold;
}

.poem-author {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.brand-mark {
  text-align: right;
  flex-shrink: 0;
}

.brand-mark p {
  font-size: 11px;
  color: #999;
}

.date-text {
  margin-top: 2px;
}
</style>
