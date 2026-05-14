<template>
  <div class="map-page">
    <div class="map-header">
      <h2 class="text-guGong text-xl font-bold">诗意地图</h2>
      <p class="text-sm text-gray-500 mt-1">标记你的诗境足迹</p>
    </div>

    <!-- 地图容器 -->
    <div class="map-container" id="map-container">
      <div class="map-placeholder" v-if="!mapLoaded">
        <van-loading v-if="mapLoading" size="36px" color="#8b2c2c" vertical>
          地图加载中...
        </van-loading>
        <template v-else-if="mapError">
          <van-icon name="warning-o" size="48" color="#8b2c2c" />
          <p class="mt-2 text-gray-500">地图加载失败</p>
          <p class="text-xs text-gray-400 mt-1">{{ mapError }}</p>
          <van-button size="small" round type="primary" class="mt-3" @click="loadMap">
            重试
          </van-button>
        </template>
        <template v-else>
          <van-icon name="location-o" size="48" color="#8b2c2c" />
          <p class="mt-2 text-gray-500">点击加载地图</p>
          <van-button size="small" round type="primary" class="mt-3" @click="loadMap">
            加载地图
          </van-button>
        </template>
      </div>
    </div>

    <!-- 打卡记录列表 -->
    <div class="checkin-list" v-if="checkins.length">
      <h3 class="list-title">打卡记录 ({{ checkins.length }})</h3>
      <div class="checkin-item" v-for="item in checkins" :key="item.id" @click="panToCheckin(item)">
        <div class="checkin-poem">
          <p class="checkin-line">「{{ item.poem?.best_line }}」</p>
          <p class="checkin-info">{{ item.poem?.title }} · {{ item.poem?.author }}</p>
        </div>
        <p class="checkin-time">{{ formatTime(item.createTime) }}</p>
      </div>
    </div>

    <div class="empty-hint" v-else>
      <p>还没有打卡记录</p>
      <p class="text-xs mt-1">拍照识诗后生成海报，点击打卡即可记录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { showToast } from 'vant'

const mapLoaded = ref(false)
const mapLoading = ref(false)
const mapError = ref('')
const checkins = ref([])

let map = null
let markers = []
let infoWindow = null

onMounted(() => {
  // 读取打卡记录
  try {
    const data = localStorage.getItem('poeticlens_checkins')
    checkins.value = data ? JSON.parse(data) : []
  } catch (e) {
    checkins.value = []
  }

  // 自动尝试加载地图
  loadMap()
})

onBeforeUnmount(() => {
  // 清理地图资源
  if (map) {
    map.destroy()
    map = null
  }
  markers = []
  infoWindow = null
})

/**
 * 动态加载高德地图 JS API
 */
function loadMap() {
  const amapKey = import.meta.env.VITE_AMAP_KEY

  if (!amapKey) {
    mapError.value = '未配置高德地图 Key，请在 .env 中设置 VITE_AMAP_KEY'
    return
  }

  // 如果已加载，直接初始化
  if (window.AMap) {
    initMap()
    return
  }

  // 如果正在加载中，避免重复加载
  if (mapLoading.value) return

  mapLoading.value = true
  mapError.value = ''

  // 配置安全密钥（2021年12月后申请的Key需要）
  const securityCode = import.meta.env.VITE_AMAP_SECURITY_CODE
  if (securityCode) {
    window._AMapSecurityConfig = {
      securityJsCode: securityCode,
    }
  }

  const script = document.createElement('script')
  script.src = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`
  script.async = true

  script.onload = () => {
    mapLoading.value = false
    initMap()
  }

  script.onerror = () => {
    mapLoading.value = false
    mapError.value = '高德地图 JS API 加载失败，请检查网络'
  }

  document.head.appendChild(script)
}

/**
 * 初始化地图
 */
function initMap() {
  if (!window.AMap) {
    mapError.value = '高德地图 JS API 未加载'
    return
  }

  try {
    // 默认中心点（北京天安门）
    const defaultCenter = [116.397428, 39.90923]

    map = new AMap.Map('map-container', {
      zoom: 12,
      center: defaultCenter,
      resizeEnable: true,
    })

    mapLoaded.value = true

    // 添加打卡标记
    addCheckinMarkers()

    // 尝试定位到用户当前位置
    locateUser()
  } catch (e) {
    console.error('地图初始化失败', e)
    mapError.value = '地图初始化失败: ' + e.message
  }
}

/**
 * 定位用户当前位置
 */
function locateUser() {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      if (map) {
        map.setCenter([longitude, latitude])
      }
    },
    () => {
      // 定位失败，使用默认位置，不提示
    },
    { timeout: 5000 }
  )
}

/**
 * 添加打卡标记到地图
 */
function addCheckinMarkers() {
  if (!map || !checkins.value.length) return

  // 清除旧标记
  markers.forEach((m) => map.remove(m))
  markers = []

  // 创建信息弹窗
  infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -30),
    isCustom: false,
  })

  checkins.value.forEach((record) => {
    if (!record.location || !record.location.lat || !record.location.lng) return

    const position = [record.location.lng, record.location.lat]

    // 自定义标记图标
    const markerContent = document.createElement('div')
    markerContent.className = 'custom-marker'
    markerContent.innerHTML = `
      <div style="
        width: 32px; height: 32px;
        background: #8b2c2c;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <span style="
          transform: rotate(45deg);
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        ">诗</span>
      </div>
    `

    const marker = new AMap.Marker({
      position,
      content: markerContent,
      offset: new AMap.Pixel(-16, -32),
      title: record.poem?.title || '打卡点',
    })

    // 点击标记弹出信息窗口
    marker.on('click', () => {
      const poem = record.poem || {}
      const time = formatTime(record.createTime)
      const content = `
        <div style="padding: 12px; min-width: 200px; font-family: 'LXGW WenKai', serif;">
          <h4 style="margin: 0 0 6px; color: #8b2c2c; font-size: 16px;">${poem.title || '未知'}</h4>
          <p style="margin: 0 0 4px; color: #888; font-size: 12px;">${poem.dynasty || ''}·${poem.author || ''}</p>
          <p style="margin: 0 0 8px; color: #2c2c2c; font-size: 15px; letter-spacing: 0.1em;">「${poem.best_line || ''}」</p>
          <p style="margin: 0; color: #aaa; font-size: 11px;">📅 ${time}</p>
        </div>
      `
      infoWindow.setContent(content)
      infoWindow.open(map, position)
    })

    markers.push(marker)
    map.add(marker)
  })

  // 如果有标记，自动调整视野包含所有标记
  if (markers.length > 0) {
    map.setFitView(markers, false, [60, 60, 60, 60])
  }
}

/**
 * 点击打卡记录，地图平移到对应位置
 */
function panToCheckin(item) {
  if (!map || !item.location || !item.location.lat) {
    showToast('该打卡记录无位置信息')
    return
  }

  const position = [item.location.lng, item.location.lat]
  map.setZoomAndCenter(14, position)

  // 触发对应标记的点击事件
  const targetMarker = markers.find((m) => {
    const pos = m.getPosition()
    return pos && Math.abs(pos.lng - item.location.lng) < 0.0001 && Math.abs(pos.lat - item.location.lat) < 0.0001
  })

  if (targetMarker) {
    targetMarker.emit('click')
  }
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.map-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%);
  padding-bottom: 80px;
}

.map-header {
  text-align: center;
  padding: 20px 16px 12px;
}

.map-container {
  width: 100%;
  height: 400px;
  background: rgba(255, 255, 255, 0.5);
  position: relative;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(245, 240, 232, 0.8);
}

.list-title {
  font-size: 16px;
  color: #8b2c2c;
  margin: 16px 16px 8px;
}

.checkin-item {
  margin: 0 16px 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.checkin-item:active {
  background: rgba(255, 255, 255, 0.9);
}

.checkin-line {
  font-size: 15px;
  color: #2c2c2c;
}

.checkin-info {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.checkin-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.empty-hint {
  text-align: center;
  padding: 40px 16px;
  color: #999;
}
</style>
