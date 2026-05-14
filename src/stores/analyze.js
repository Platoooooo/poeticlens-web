import { defineStore } from 'pinia'
import { ref } from 'vue'
import { analyzeImage } from '../api/index.js'
import { matchPoems } from '../utils/match.js'
import poetryData from '../assets/data/poetry.json'

export const useAnalyzeStore = defineStore('analyze', () => {
  const imageBase64 = ref('')
  const analysisResult = ref(null)
  const matchedPoems = ref([])
  const selectedPoem = ref(null)
  const loading = ref(false)
  const error = ref('')

  /**
   * 拍照后执行：AI 识别 + 匹配诗词
   */
  async function analyzeAndMatch(base64) {
    loading.value = true
    error.value = ''
    imageBase64.value = base64

    try {
      // 1. 调用 AI 识别
      const res = await analyzeImage(base64)
      if (!res.success) {
        throw new Error(res.error || 'AI 识别失败')
      }
      analysisResult.value = res.data

      // 2. 匹配诗词
      matchedPoems.value = matchPoems(res.data, poetryData)

      // 3. 默认选中第一首
      if (matchedPoems.value.length > 0) {
        selectedPoem.value = matchedPoems.value[0]
      }
    } catch (err) {
      console.error('识别失败:', err)
      error.value = err.message || 'AI 识别失败，请重试'

      // 降级：使用 demo 数据
      analysisResult.value = {
        season: '秋',
        time: '昏',
        objects: ['山', '枫叶'],
        mood: ['幽静'],
        keywords: ['秋色', '山林'],
        description: '秋日山林，枫叶如火',
      }
      matchedPoems.value = matchPoems(analysisResult.value, poetryData)
      if (matchedPoems.value.length > 0) {
        selectedPoem.value = matchedPoems.value[0]
      }
    } finally {
      loading.value = false
    }
  }

  function selectPoem(poem) {
    selectedPoem.value = poem
  }

  function reset() {
    imageBase64.value = ''
    analysisResult.value = null
    matchedPoems.value = []
    selectedPoem.value = null
    error.value = ''
  }

  return {
    imageBase64,
    analysisResult,
    matchedPoems,
    selectedPoem,
    loading,
    error,
    analyzeAndMatch,
    selectPoem,
    reset,
  }
})
