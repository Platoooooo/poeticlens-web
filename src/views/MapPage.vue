<template>
  <div class="map-page">
    <div class="map-header">
      <h2 class="text-guGong text-xl font-bold">诗意地图</h2>
      <p class="text-sm text-gray-500 mt-1">标记你的诗境足迹</p>
    </div>

    <!-- 地图占位 -->
    <div class="map-container" id="map-container">
      <div class="map-placeholder" v-if="!mapLoaded">
        <van-icon name="location-o" size="48" color="#8b2c2c" />
        <p class="mt-2 text-gray-500">地图加载中...</p>
        <p class="text-xs text-gray-400 mt-1">如需地图功能，请接入高德地图 JS API</p>
      </div>
    </div>

    <!-- 打卡记录列表 -->
    <div class="checkin-list" v-if="checkins.length">
      <h3 class="list-title">打卡记录 ({{ checkins.length }})</h3>
      <div class="checkin-item" v-for="item in checkins" :key="item.id">
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
import { ref, onMounted } from 'vue'

const mapLoaded = ref(false)
const checkins = ref([])

onMounted(() => {
  // 读取打卡记录
  try {
    const data = localStorage.getItem('poeticlens_checkins')
    checkins.value = data ? JSON.parse(data) : []
  } catch (e) {
    checkins.value = []
  }
})

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
}

.map-header {
  text-align: center;
  padding: 20px 16px 12px;
}

.map-container {
  width: 100%;
  height: 300px;
  background: rgba(255, 255, 255, 0.5);
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
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
