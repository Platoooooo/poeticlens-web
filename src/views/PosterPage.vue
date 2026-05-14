<template>
  <div class="poster-page">
    <!-- 顶部导航 -->
    <van-nav-bar left-text="返回" left-arrow @click-left="goBack" title="诗境海报" />

    <!-- 模板切换 -->
    <div class="template-switcher" v-if="analyzeStore.selectedPoem">
      <button
        v-for="t in templates"
        :key="t.id"
        class="template-btn"
        :class="{ active: currentTemplate === t.id }"
        @click="currentTemplate = t.id"
      >
        {{ t.name }}
      </button>
    </div>

    <!-- 海报预览 -->
    <div class="poster-preview" v-if="analyzeStore.selectedPoem">
      <component
        :is="templateComponent"
        :ref="setTemplateRef"
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
      <van-button round block plain @click="showMultiDynasty = true" class="mt-2">
        🕰️ 跨时空对话
      </van-button>
      <van-button round block plain @click="goBack" class="mt-2">
        返回首页
      </van-button>
    </div>

    <!-- 跨时空对话弹窗 -->
    <van-popup v-model:show="showMultiDynasty" position="right" :style="{ width: '100%', height: '100%' }">
      <MultiDynasty @close="showMultiDynasty = false" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useAnalyzeStore } from '../stores/analyze.js'
import { checkNewAchievements } from '../utils/achievement.js'
import InkWash from '../components/PosterTemplate/InkWash.vue'
import PalaceRed from '../components/PosterTemplate/PalaceRed.vue'
import Minimal from '../components/PosterTemplate/Minimal.vue'
import MultiDynasty from '../components/MultiDynasty.vue'
import { exportPoster, savePoster, sharePoster } from '../utils/poster.js'

const router = useRouter()
const analyzeStore = useAnalyzeStore()
const saving = ref(false)
const currentTemplate = ref('ink-wash')
const showMultiDynasty = ref(false)
const templateRefs = shallowRef({})

const templates = [
  { id: 'ink-wash', name: '水墨江南', component: InkWash },
  { id: 'palace-red', name: '故宫红韵', component: PalaceRed },
  { id: 'minimal', name: '极简留白', component: Minimal },
]

const templateComponent = computed(() => {
  const t = templates.find((t) => t.id === currentTemplate.value)
  return t ? t.component : InkWash
})

function setTemplateRef(el) {
  if (el) {
    templateRefs.value = el
  }
}

async function handleSave() {
  saving.value = true
  try {
    const el = templateRefs.value?.posterRef?.$el || templateRefs.value?.posterRef || templateRefs.value?.$el
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
    const el = templateRefs.value?.posterRef?.$el || templateRefs.value?.posterRef || templateRefs.value?.$el
    if (!el) return
    const dataURL = await exportPoster(el)
    await sharePoster(dataURL)
  } catch (err) {
    console.error('分享失败', err)
  }
}

function handleCheckIn() {
  const record = {
    id: Date.now(),
    poem: analyzeStore.selectedPoem,
    analysis: analyzeStore.analysisResult,
    location: null,
    createTime: new Date().toISOString(),
  }

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

  // 检查成就
  const newAchievements = checkNewAchievements(checkins)
  if (newAchievements.length > 0) {
    setTimeout(() => {
      showAchievementDialog(newAchievements[0])
    }, 800)
  }
}

function showAchievementDialog(achievement) {
  showDialog({
    title: '🎉 成就解锁',
    message: `${achievement.icon} ${achievement.name}\n${achievement.desc}`,
    confirmButtonText: '太棒了',
    confirmButtonColor: '#8b2c2c',
  })
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

.template-switcher {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  justify-content: center;
}

.template-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #d4af37;
  background: transparent;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-btn.active {
  background: #8b2c2c;
  color: #fff;
  border-color: #8b2c2c;
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
