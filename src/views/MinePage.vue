<template>
  <div class="mine-page">
    <div class="mine-header">
      <div class="avatar">
        <van-icon name="user-o" size="40" color="#8b2c2c" />
      </div>
      <h2 class="user-name">诗境行者</h2>
      <p class="user-desc">已记录 {{ checkinCount }} 次诗境之旅</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <p class="stat-num">{{ checkinCount }}</p>
        <p class="stat-label">打卡次数</p>
      </div>
      <div class="stat-card">
        <p class="stat-num">{{ uniquePoems }}</p>
        <p class="stat-label">遇见诗词</p>
      </div>
      <div class="stat-card">
        <p class="stat-num">{{ unlockedCount }}</p>
        <p class="stat-label">成就</p>
      </div>
    </div>

    <!-- 成就展示 -->
    <div class="achievement-section">
      <h3 class="section-title">成就勋章</h3>
      <div class="achievement-list">
        <AchievementBadge
          v-for="a in achievements"
          :key="a.id"
          :achievement="a"
        />
      </div>
    </div>

    <!-- 历史记录 -->
    <div class="history-section" v-if="checkins.length">
      <h3 class="section-title">历史记录</h3>
      <div class="history-item" v-for="item in checkins" :key="item.id">
        <div class="history-content">
          <p class="history-line">「{{ item.poem?.best_line }}」</p>
          <p class="history-info">
            {{ item.poem?.title }} · {{ item.poem?.dynasty }}·{{ item.poem?.author }}
          </p>
        </div>
        <p class="history-time">{{ formatTime(item.createTime) }}</p>
        <van-icon name="delete-o" class="delete-btn" @click="deleteItem(item.id)" />
      </div>
    </div>

    <div class="empty-hint" v-else>
      <p>还没有记录</p>
      <p class="text-xs mt-1">去首页拍照识诗吧</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import AchievementBadge from '../components/AchievementBadge.vue'
import { getAllAchievements } from '../utils/achievement.js'

const checkins = ref([])
const achievements = ref([])

onMounted(() => {
  loadCheckins()
  loadAchievements()
})

function loadCheckins() {
  try {
    const data = localStorage.getItem('poeticlens_checkins')
    checkins.value = data ? JSON.parse(data) : []
  } catch (e) {
    checkins.value = []
  }
}

function loadAchievements() {
  achievements.value = getAllAchievements()
}

const checkinCount = computed(() => checkins.value.length)

const uniquePoems = computed(() => {
  const set = new Set(checkins.value.map((c) => c.poem?.id))
  return set.size
})

const unlockedCount = computed(() => {
  return achievements.value.filter((a) => a.unlocked).length
})

function deleteItem(id) {
  checkins.value = checkins.value.filter((c) => c.id !== id)
  localStorage.setItem('poeticlens_checkins', JSON.stringify(checkins.value))
  showToast('已删除')
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%);
  padding-bottom: 80px;
}

.mine-header {
  text-align: center;
  padding: 32px 16px 16px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(139, 44, 44, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.user-name {
  font-size: 20px;
  color: #2c2c2c;
}

.user-desc {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.stats-cards {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  text-align: center;
  padding: 16px 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
}

.stat-num {
  font-size: 24px;
  color: #8b2c2c;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.achievement-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  color: #8b2c2c;
  margin: 16px 16px 8px;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}

.history-item {
  margin: 0 16px 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-content {
  flex: 1;
}

.history-line {
  font-size: 15px;
  color: #2c2c2c;
}

.history-info {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.history-time {
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
}

.delete-btn {
  color: #ccc;
  font-size: 18px;
  flex-shrink: 0;
}

.empty-hint {
  text-align: center;
  padding: 40px 16px;
  color: #999;
}
</style>
