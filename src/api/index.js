import axios from 'axios'
import demoData from '../assets/data/demo.json'

const request = axios.create({
  baseURL: '/',
  timeout: 60000,
})

/**
 * 图像识别 — 分析场景
 * @param {string} base64 - 图片 Base64
 * @returns {Promise<Object>} 场景识别结果
 */
export function analyzeImage(base64) {
  // 检测是否离线
  if (!navigator.onLine) {
    return Promise.resolve(getDemoResult())
  }

  return request
    .post('/api/analyze', { image: base64 })
    .then((res) => res.data)
    .catch((err) => {
      console.error('AI 接口请求失败，使用 Demo 数据:', err)
      return getDemoResult()
    })
}

/**
 * AI 生成诗
 * @param {Object} sceneData - 场景数据
 * @returns {Promise<Object>} 生成的诗
 */
export function generatePoem(sceneData) {
  return request
    .post('/api/generate-poem', { sceneData })
    .then((res) => res.data)
    .catch((err) => {
      console.error('生成诗接口失败:', err)
      return { success: false, error: err.message }
    })
}

/**
 * 跨时空对话
 * @param {Object} sceneData - 场景数据
 * @returns {Promise<Object>} 三个时代的诗
 */
export function multiDynasty(sceneData) {
  return request
    .post('/api/multi-dynasty', { sceneData })
    .then((res) => res.data)
    .catch((err) => {
      console.error('跨时空对话接口失败:', err)
      return { success: false, error: err.message }
    })
}

/**
 * 获取 Demo 降级数据
 */
function getDemoResult() {
  const idx = Math.floor(Math.random() * demoData.length)
  return {
    success: true,
    data: demoData[idx].analysis,
    _isDemo: true,
  }
}

export default request
