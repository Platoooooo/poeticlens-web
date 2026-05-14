<template>
  <div class="analyze-page">
    <!-- 返回按钮 -->
    <van-nav-bar left-text="返回" left-arrow @click-left="goBack" title="诗境识别" />

    <!-- 图片缩略图 -->
    <div class="image-preview" v-if="analyzeStore.imageBase64">
      <img :src="analyzeStore.imageBase64" alt="拍摄图片" />
    </div>

    <!-- 场景信息卡片 -->
    <div class="scene-card" v-if="analyzeStore.analysisResult">
      <h3 class="card-title">场景识别</h3>
      <p class="scene-desc">{{ analyzeStore.analysisResult.description }}</p>
      <div class="tag-group">
        <van-tag
          v-for="tag in allTags"
          :key="tag"
          type="primary"
          plain
          size="medium"
          class="scene-tag"
        >
          {{ tag }}
        </van-tag>
      </div>
    </div>

    <!-- 匹配诗词列表 -->
    <div class="poem-list" v-if="analyzeStore.matchedPoems.length">
      <h3 class="section-title">为你觅得 {{ analyzeStore.matchedPoems.length }} 首诗</h3>
      <PoemCard
        v-for="(poem, index) in analyzeStore.matchedPoems"
        :key="poem.id"
        :poem="poem"
        :rank="index + 1"
        :selected="analyzeStore.selectedPoem?.id === poem.id"
        @select="onSelectPoem"
      />
    </div>

    <!-- 错误提示 -->
    <div class="error-hint" v-if="analyzeStore.error">
      <van-notice-bar :text="analyzeStore.error" type="warning" />
    </div>

    <!-- 底部操作 -->
    <div class="bottom-actions">
      <van-button round block type="primary" @click="goToPoster" :disabled="!analyzeStore.selectedPoem">
        生成海报
      </van-button>
      <van-button round block plain @click="goBack" class="mt-3">
        重新拍照
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAnalyzeStore } from '../stores/analyze.js'
import PoemCard from '../components/PoemCard.vue'

const router = useRouter()
const analyzeStore = useAnalyzeStore()

const allTags = computed(() => {
  const r = analyzeStore.analysisResult
  if (!r) return []
  return [
    r.season,
    r.time,
    ...(r.objects || []),
    ...(r.mood || []),
    ...(r.keywords || []),
  ].filter(Boolean)
})

function onSelectPoem(poem) {
  analyzeStore.selectPoem(poem)
}

function goToPoster() {
  router.push('/poster')
}

function goBack() {
  analyzeStore.reset()
  router.push('/')
}
</script>

<style scoped>
.analyze-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%);
  padding-bottom: 120px;
}

.image-preview {
  padding: 12px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: contain;
}

.scene-card {
  margin: 12px 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
}

.card-title {
  font-size: 16px;
  color: #8b2c2c;
  margin-bottom: 8px;
}

.scene-desc {
  font-size: 15px;
  color: #2c2c2c;
  margin-bottom: 12px;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.scene-tag {
  background: rgba(139, 44, 44, 0.08) !important;
  color: #8b2c2c !important;
  border-color: #8b2c2c !important;
}

.section-title {
  font-size: 16px;
  color: #8b2c2c;
  margin: 16px 16px 8px;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: env(safe-area-inset-bottom, 12px);
  background: rgba(245, 240, 232, 0.95);
  backdrop-filter: blur(10px);
}

.mt-3 {
  margin-top: 8px;
}
</style>
