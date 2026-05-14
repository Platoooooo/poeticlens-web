<template>
  <div class="poem-card" :class="{ selected }" @click="$emit('select', poem)">
    <div class="rank-badge" v-if="rank">{{ rank }}</div>
    <div class="poem-content">
      <div class="poem-header">
        <div>
          <h4 class="poem-title">{{ poem.title }}</h4>
          <p class="poem-author">{{ poem.dynasty }} · {{ poem.author }}</p>
        </div>
        <SpeechButton :text="poem.best_line" />
      </div>
      <p class="poem-best-line" @click.stop="expanded = !expanded">「{{ poem.best_line }}」</p>
      <transition name="expand">
        <p class="poem-full" v-if="expanded">{{ poem.content }}</p>
      </transition>
    </div>
    <div class="poem-score" v-if="poem.score">匹配度 {{ poem.score }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SpeechButton from './SpeechButton.vue'

defineProps({
  poem: { type: Object, required: true },
  rank: { type: Number, default: 0 },
  selected: { type: Boolean, default: false },
})

defineEmits(['select'])

const expanded = ref(false)
</script>

<style scoped>
.poem-card {
  margin: 0 16px 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.poem-card:active {
  transform: scale(0.98);
}

.poem-card.selected {
  border: 2px solid #8b2c2c;
  background: rgba(139, 44, 44, 0.05);
}

.rank-badge {
  position: absolute;
  top: -6px;
  right: 12px;
  background: #d4af37;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.poem-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.poem-title {
  font-size: 18px;
  color: #2c2c2c;
  margin-bottom: 2px;
}

.poem-author {
  font-size: 13px;
  color: #888;
}

.poem-best-line {
  font-size: 16px;
  color: #8b2c2c;
  letter-spacing: 0.05em;
  line-height: 1.6;
}

.poem-full {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  line-height: 1.8;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.poem-score {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #d4af37;
}
</style>
