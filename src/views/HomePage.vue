<template>
  <div class="home-page">
    <!-- 品牌展示 -->
    <div class="brand-area">
      <h1 class="brand-title">诗境</h1>
      <p class="brand-slogan">以诗之眼，观世间万象</p>
    </div>

    <!-- 拍照/选择入口 -->
    <ImageUploader @ready="onImageReady" v-if="!loading" />

    <!-- Loading 遮罩 -->
    <van-overlay :show="loading" class="loading-overlay">
      <div class="loading-wrapper">
        <van-loading type="spinner" color="#8b2c2c" size="36px" />
        <p class="loading-text">AI 正在为你寻诗...</p>
      </div>
    </van-overlay>

    <!-- 今日一诗 -->
    <div class="daily-poem" v-if="!loading && dailyPoem">
      <div class="daily-label">今日一诗</div>
      <p class="daily-content">{{ dailyPoem.best_line }}</p>
      <p class="daily-info">—— {{ dailyPoem.author }}《{{ dailyPoem.title }}》</p>
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
  // 随机取一首诗
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
  padding: 40px 20px 20px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%);
}

.brand-area {
  text-align: center;
  margin-bottom: 32px;
}

.brand-title {
  font-size: 48px;
  color: #8b2c2c;
  font-weight: bold;
  letter-spacing: 0.1em;
}

.brand-slogan {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
  letter-spacing: 0.05em;
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
  gap: 16px;
}

.loading-text {
  font-size: 16px;
  color: #8b2c2c;
  letter-spacing: 0.1em;
}

.daily-poem {
  margin-top: 40px;
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
}

.daily-label {
  font-size: 12px;
  color: #d4af37;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.daily-content {
  font-size: 20px;
  color: #2c2c2c;
  line-height: 1.6;
  letter-spacing: 0.05em;
}

.daily-info {
  font-size: 13px;
  color: #888;
  margin-top: 8px;
}
</style>
