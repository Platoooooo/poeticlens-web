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
        :location="showLocation ? locationName : ''"
      />
    </div>

    <!-- 无数据提示 -->
    <div class="no-data" v-else>
      <p>暂无海报数据，请先拍照识诗</p>
      <van-button type="primary" round @click="goBack">去拍照</van-button>
    </div>

    <!-- 显示地点开关 -->
    <div class="location-toggle" v-if="analyzeStore.selectedPoem">
      <span class="toggle-label">{{ locationLoading ? '定位中...' : '显示地点' }}</span>
      <van-switch v-model="showLocation" size="20px" @change="onLocationToggle" :disabled="locationLoading" />
      <span class="location-name" v-if="showLocation && locationName">{{ locationName }}</span>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar" v-if="analyzeStore.selectedPoem">
      <van-button round block type="primary" @click="handleSave" :loading="saving">
        {{ isMobile ? '保存/分享' : '保存到相册' }}
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
const showLocation = ref(true)
const locationName = ref('')
const locationLoading = ref(false)

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

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
    await savePoster(dataURL)
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

async function onLocationToggle(val) {
  if (val && !locationName.value) {
    await getLocationName()
  }
}

async function getLocationName() {
  if (locationName.value) return

  if (!navigator.geolocation) {
    showLocation.value = false
    showToast('浏览器不支持定位')
    return
  }

  locationLoading.value = true
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
    })
    const { latitude: lat, longitude: lng } = pos.coords
    await reverseGeocode(lat, lng)
  } catch {
    showLocation.value = false
    showToast('定位失败，已关闭地点显示')
  } finally {
    locationLoading.value = false
  }
}

async function reverseGeocode(lat, lng) {
  // 确保高德地图脚本已加载
  await loadAMapScript()
  await new Promise((resolve) => {
    if (window.AMap) return resolve()
    const check = setInterval(() => {
      if (window.AMap) { clearInterval(check); resolve() }
    }, 100)
  })

  return new Promise((resolve, reject) => {
    window.AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new window.AMap.Geocoder()
      geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const { province, city, district } = result.regeocode.addressComponent
          // 格式化：直辖市显示"城市·区县"，其他显示"省份·城市"
          const isDirectCity = ['北京', '天津', '上海', '重庆'].some(c => province.includes(c))
          if (isDirectCity) {
            locationName.value = city ? `${city}·${district}` : province
          } else {
            locationName.value = city ? `${province.replace(/省$/, '')}·${city.replace(/市$/, '')}` : province
          }
          resolve()
        } else {
          reject(new Error('逆地理编码失败'))
        }
      })
    })
  })
}

function loadAMapScript() {
  return new Promise((resolve) => {
    if (window.AMap) return resolve()
    const existing = document.querySelector('script[src*="webapi.amap.com"]')
    if (existing) return resolve()
    const key = import.meta.env.VITE_AMAP_KEY
    if (!key) { resolve(); return }
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}&plugin=AMap.Geocoder`
    script.onload = resolve
    script.onerror = resolve
    document.head.appendChild(script)
  })
}

// 页面加载时自动获取地点
if (showLocation.value) {
  getLocationName()
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

.location-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
}

.toggle-label {
  font-size: 13px;
  color: #888;
}

.location-name {
  font-size: 12px;
  color: #8b2c2c;
  background: rgba(139, 44, 44, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
}
</style>
