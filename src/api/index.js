import axios from 'axios'

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
  return request.post('/api/analyze', { image: base64 }).then((res) => res.data)
}

/**
 * AI 生成诗
 * @param {Object} sceneData - 场景数据
 * @returns {Promise<Object>} 生成的诗
 */
export function generatePoem(sceneData) {
  return request.post('/api/generate-poem', { sceneData }).then((res) => res.data)
}

/**
 * 跨时空对话
 * @param {Object} sceneData - 场景数据
 * @returns {Promise<Object>} 三个时代的诗
 */
export function multiDynasty(sceneData) {
  return request.post('/api/multi-dynasty', { sceneData }).then((res) => res.data)
}

export default request
