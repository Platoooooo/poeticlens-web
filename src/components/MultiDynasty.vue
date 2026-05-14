<template>
  <div class="multi-dynasty">
    <van-nav-bar left-text="返回" left-arrow @click-left="$emit('close')" title="跨时空对话" />

    <div class="dynasty-intro">
      <p>同一片风景，三个时代的诗人各有吟咏</p>
    </div>

    <van-loading v-if="loading" class="loading-center" size="36px" color="#8b2c2c">
      AI 正在穿越时空...
    </van-loading>

    <van-swipe v-else-if="dynastyData" :autoplay="0" indicator-color="#8b2c2c" class="dynasty-swipe">
      <van-swipe-item v-for="item in dynastyList" :key="item.key">
        <div class="dynasty-card" :class="item.key">
          <div class="dynasty-era">{{ item.era }}</div>
          <div class="dynasty-style">{{ item.style }}</div>
          <div class="dynasty-poem">
            <h3 class="poem-title">{{ item.data.title }}</h3>
            <p class="poem-content">{{ item.data.content }}</p>
          </div>
          <div class="dynasty-best-line">
            <p>「{{ item.data.best_line }}」</p>
          </div>
          <div class="swipe-hint">← 左右滑动切换时代 →</div>
        </div>
      </van-swipe-item>
    </van-swipe>

    <div class="error-hint" v-else-if="error">
      <van-notice-bar :text="error" type="warning" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { multiDynasty } from '../api/index.js'
import { useAnalyzeStore } from '../stores/analyze.js'

defineEmits(['close'])

const analyzeStore = useAnalyzeStore()
const loading = ref(false)
const dynastyData = ref(null)
const error = ref('')

const dynastyList = computed(() => {
  if (!dynastyData.value) return []
  return [
    { key: 'tang', era: '唐', style: '盛世气象', data: dynastyData.value.tang || {} },
    { key: 'song', era: '宋', style: '婉约风雅', data: dynastyData.value.song || {} },
    { key: 'modern', era: '当代', style: '现代抒怀', data: dynastyData.value.modern || {} },
  ]
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const sceneData = analyzeStore.analysisResult
    if (!sceneData) {
      error.value = '暂无场景数据'
      loading.value = false
      return
    }

    const res = await multiDynasty(sceneData)
    if (res.success) {
      dynastyData.value = res.data
    } else {
      // 降级：使用模拟数据
      dynastyData.value = getFallbackData()
    }
  } catch (err) {
    console.error('跨时空对话失败:', err)
    dynastyData.value = getFallbackData()
  } finally {
    loading.value = false
  }
})

function getFallbackData() {
  const scene = analyzeStore.analysisResult
  const mood = scene?.mood?.[0] || '幽静'
  return {
    tang: {
      title: '秋山远望',
      content: '秋山横翠远云低，一曲清歌入画溪。霜叶纷纷如蝶舞，闲来独坐看天西。',
      best_line: '霜叶纷纷如蝶舞',
    },
    song: {
      title: '临江仙·秋思',
      content: '独倚危楼风细细，秋山如画入帘来。霜林染尽千重翠，一任斜阳送晚霭。',
      best_line: '霜林染尽千重翠',
    },
    modern: {
      title: '秋日独白',
      content: '我站在十月的山脊上，看那些叶子，用最后的红，写给天空的情书。风翻过每一页，都是离别的理由。',
      best_line: '用最后的红写给天空的情书',
    },
  }
}
</script>

<style scoped>
.multi-dynasty {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%);
  padding-bottom: 40px;
}

.dynasty-intro {
  text-align: center;
  padding: 16px;
  color: #888;
  font-size: 14px;
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.dynasty-swipe {
  margin: 0 16px;
  border-radius: 12px;
  overflow: hidden;
}

.dynasty-card {
  min-height: 400px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.dynasty-card.tang {
  background: linear-gradient(180deg, #f5e6d0 0%, #e8d5b8 100%);
}

.dynasty-card.song {
  background: linear-gradient(180deg, #e8e0d8 0%, #d5ccc0 100%);
}

.dynasty-card.modern {
  background: linear-gradient(180deg, #e0e5ec 0%, #d0d8e0 100%);
}

.dynasty-era {
  font-size: 36px;
  color: #8b2c2c;
  font-weight: bold;
  margin-bottom: 4px;
}

.dynasty-style {
  font-size: 14px;
  color: #888;
  margin-bottom: 24px;
}

.poem-title {
  font-size: 20px;
  color: #2c2c2c;
  margin-bottom: 16px;
}

.poem-content {
  font-size: 16px;
  color: #444;
  line-height: 2;
  letter-spacing: 0.05em;
  max-width: 280px;
}

.dynasty-best-line {
  margin-top: 24px;
  padding: 12px 20px;
  background: rgba(139, 44, 44, 0.08);
  border-radius: 8px;
}

.dynasty-best-line p {
  font-size: 18px;
  color: #8b2c2c;
  letter-spacing: 0.1em;
}

.swipe-hint {
  margin-top: 24px;
  font-size: 12px;
  color: #bbb;
}

.error-hint {
  margin: 16px;
}
</style>
