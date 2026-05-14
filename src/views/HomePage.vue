<template>
  <div class="home-page">
    <!-- 品牌展示 -->
    <div class="brand-area animate-fade-in-up">
      <h1 class="brand-title">诗境</h1>
      <p class="brand-slogan">以诗之眼，观世间万象</p>
      <div class="brand-divider"></div>
    </div>

    <!-- 拍照/选择入口 -->
    <ImageUploader @ready="onImageReady" v-if="!loading" />

    <!-- Loading 遮罩 -->
    <van-overlay :show="loading" class="loading-overlay">
      <div class="loading-wrapper">
        <div class="ink-loader">
          <div class="ink-circle"></div>
          <div class="ink-circle delay-1"></div>
          <div class="ink-circle delay-2"></div>
        </div>
        <p class="loading-text">AI 正在为你寻诗...</p>
        <p class="loading-sub" v-if="analyzeStore.isDemo">（使用演示数据）</p>
      </div>
    </van-overlay>

    <!-- 今日一诗 -->
    <div class="daily-poem animate-fade-in-up" v-if="!loading && dailyPoem" style="animation-delay: 0.2s">
      <div class="daily-label">今日一诗</div>
      <p class="daily-content">「{{ dailyPoem.best_line }}」</p>
      <p class="daily-info">—— {{ dailyPoem.dynasty }}·{{ dailyPoem.author }}《{{ dailyPoem.title }}》</p>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-ornament" v-if="!loading">
      <div class="ornament-line"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ImageUploader from '../components/ImageUploader.vue'
import { useAnalyzeStore } from '../stores/analyze.js'
import poetryData from '../assets/data/poetry.json'

const router = useRouter()
const analyzeStore = useAnalyzeStore()
const loading = ref(false)
const dailyPoem = ref(null)

onMounted(() => {
  const idx = Math.floor(Math.random() * poetryData.length)
  dailyPoem.value = poetryData[idx]
})

async function onImageReady({ base64 }) {
  loading.value = true
  await analyzeStore.analyzeAndMatch(base64)
  loading.value = false
  router.push('/analyze')
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 20px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%);
}

.brand-area {
  text-align: center;
  margin-bottom: 32px;
}

.brand-title {
  font-size: 52px;
  color: #8b2c2c;
  font-weight: bold;
  letter-spacing: 0.15em;
  text-shadow: 0 2px 8px rgba(139, 44, 44, 0.1);
}

.brand-slogan {
  font-size: 15px;
  color: #888;
  margin-top: 8px;
  letter-spacing: 0.1em;
}

.brand-divider {
  width: 32px;
  height: 2px;
  background: #d4af37;
  margin: 16px auto 0;
  border-radius: 1px;
}

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.ink-loader {
  display: flex;
  gap: 8px;
}

.ink-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #8b2c2c;
  animation: inkPulse 1.2s ease-in-out infinite;
}

.ink-circle.delay-1 {
  animation-delay: 0.2s;
  opacity: 0.7;
}

.ink-circle.delay-2 {
  animation-delay: 0.4s;
  opacity: 0.5;
}

@keyframes inkPulse {
  0%, 100% {
    transform: scale(0.6);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  font-size: 16px;
  color: #8b2c2c;
  letter-spacing: 0.1em;
}

.loading-sub {
  font-size: 12px;
  color: #aaa;
}

.daily-poem {
  margin-top: 40px;
  text-align: center;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.daily-label {
  font-size: 12px;
  color: #d4af37;
  letter-spacing: 0.2em;
  margin-bottom: 10px;
}

.daily-content {
  font-size: 20px;
  color: #2c2c2c;
  line-height: 1.6;
  letter-spacing: 0.08em;
}

.daily-info {
  font-size: 13px;
  color: #888;
  margin-top: 10px;
}

.bottom-ornament {
  margin-top: 40px;
}

.ornament-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}
</style>
