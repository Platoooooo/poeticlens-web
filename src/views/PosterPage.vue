<template>
  <div class="poster-page">
    <!-- 顶部导航 -->
    <van-nav-bar left-text="返回" left-arrow @click-left="goBack" title="诗境海报" />

    <!-- 海报预览 -->
    <div class="poster-preview" v-if="analyzeStore.selectedPoem">
      <InkWash
        ref="inkWashRef"
        :image="analyzeStore.imageBase64"
        :poem="analyzeStore.selectedPoem"
        :description="analyzeStore.analysisResult?.description"
      />
    </div>

    <!-- 无数据提示 -->
    <div class="no-data" v-else>
      <p>暂无海报数据，请先拍照识诗</p>
      <van-button type="primary" round @click="goBack">去拍照</van-button>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar" v-if="analyzeStore.selectedPoem">
      <van-button round block type="primary" @click="handleSave" :loading="saving">
        保存到相册
      </van-button>
      <van-button round block plain @click="handleShare" class="mt-2">
        分享
      </van-button>
      <van-button round block plain @click="handleCheckIn" class="mt-2">
        打卡
      </van-button>
      <van-button round block plain @click="goBack" class="mt-2">
        返回首页
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAnalyzeStore } from '../stores/analyze.js'
import { setItem } from '../utils/storage.js'
import InkWash from '../components/PosterTemplate/InkWash.vue'
import { exportPoster, savePoster, sharePoster } from '../utils/poster.js'

const router = useRouter()
const analyzeStore = useAnalyzeStore()
const inkWashRef = ref(null)
const saving = ref(false)

async function handleSave() {
  saving.value = true
  try {
    const el = inkWashRef.value?.posterRef?.$el || inkWashRef.value?.posterRef
    if (!el) {
      showToast('海报元素未找到')
      return
    }
    const dataURL = await exportPoster(el)
    savePoster(dataURL)
    showToast('海报已生成，请保存')
  } catch (err) {
    console.error('导出失败', err)
    showToast('导出失败，请重试')
  } finally {
    saving.value = false
  }
}

async function handleShare() {
  try {
    const el = inkWashRef.value?.posterRef?.$el || inkWashRef.value?.posterRef
    if (!el) return
    const dataURL = await exportPoster(el)
    await sharePoster(dataURL)
  } catch (err) {
    console.error('分享失败', err)
  }
}

function handleCheckIn() {
  // 获取位置（简化版）
  const record = {
    id: Date.now(),
    poem: analyzeStore.selectedPoem,
    analysis: analyzeStore.analysisResult,
    location: null,
    createTime: new Date().toISOString(),
  }

  // 尝试获取位置
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        record.location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        saveCheckIn(record)
      },
      () => {
        // 定位失败也允许打卡
        saveCheckIn(record)
      },
      { timeout: 5000 }
    )
  } else {
    saveCheckIn(record)
  }
}

function saveCheckIn(record) {
  const checkins = JSON.parse(localStorage.getItem('poeticlens_checkins') || '[]')
  checkins.unshift(record)
  localStorage.setItem('poeticlens_checkins', JSON.stringify(checkins))
  showToast('打卡成功！')
}

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.poster-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%);
  padding-bottom: 24px;
}

.poster-preview {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #888;
  gap: 16px;
}

.action-bar {
  padding: 16px;
  max-width: 320px;
  margin: 0 auto;
}

.mt-2 {
  margin-top: 8px;
}
</style>
