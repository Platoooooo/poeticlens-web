<template>
  <div class="achievement-badge" :class="{ unlocked: achievement.unlocked }">
    <div class="badge-icon">{{ achievement.unlocked ? achievement.icon : '🔒' }}</div>
    <div class="badge-info">
      <p class="badge-name">{{ achievement.unlocked ? achievement.name : '???' }}</p>
      <p class="badge-desc">{{ achievement.unlocked ? achievement.desc : '继续探索以解锁' }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  achievement: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.achievement-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.achievement-badge.unlocked {
  background: rgba(212, 175, 55, 0.12);
  border: 1px solid rgba(212, 175, 55, 0.3);
  opacity: 1;
}

.badge-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.badge-name {
  font-size: 15px;
  color: #2c2c2c;
  font-weight: bold;
}

.badge-desc {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
</style>
