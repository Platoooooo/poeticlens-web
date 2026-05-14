<template>
  <button class="speech-btn" :class="{ speaking }" @click="toggleSpeech" :title="speaking ? '停止朗读' : '朗读诗句'">
    <span class="icon">{{ speaking ? '🔊' : '🔈' }}</span>
    <span class="ripple" v-if="speaking"></span>
  </button>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
})

const speaking = ref(false)

function toggleSpeech() {
  if (speaking.value) {
    speechSynthesis.cancel()
    speaking.value = false
    return
  }

  if (!('speechSynthesis' in window)) {
    alert('您的浏览器不支持语音朗读')
    return
  }

  const utterance = new SpeechSynthesisUtterance(props.text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.8
  utterance.pitch = 0.9

  utterance.onend = () => {
    speaking.value = false
  }
  utterance.onerror = () => {
    speaking.value = false
  }

  speaking.value = true
  speechSynthesis.speak(utterance)
}

onUnmounted(() => {
  speechSynthesis.cancel()
})
</script>

<style scoped>
.speech-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d4af37;
  background: rgba(212, 175, 55, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.speech-btn:hover {
  background: rgba(212, 175, 55, 0.2);
}

.speech-btn.speaking {
  border-color: #8b2c2c;
  background: rgba(139, 44, 44, 0.1);
}

.icon {
  font-size: 18px;
  line-height: 1;
}

.ripple {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(139, 44, 44, 0.3);
  animation: ripple 1s ease-out infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
