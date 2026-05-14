/**
 * 诗词匹配算法
 */

/**
 * 匹配诗词
 * @param {Object} analysis - AI 识别结果
 * @param {Array} poems - 诗词列表
 * @returns {Array} 匹配排序后的诗词
 */
export function matchPoems(analysis, poems) {
  if (!analysis || !poems || poems.length === 0) return []

  const inputTags = [
    analysis.season,
    analysis.time,
    ...(analysis.objects || []),
    ...(analysis.mood || []),
    ...(analysis.keywords || []),
  ].filter(Boolean)

  if (inputTags.length === 0) return poems.slice(0, 5)

  return poems
    .map((poem) => ({
      ...poem,
      score: calculateScore(inputTags, poem.tags || []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

function calculateScore(inputTags, poemTags) {
  let score = 0
  for (const t of inputTags) {
    for (const tag of poemTags) {
      if (tag.includes(t) || t.includes(tag)) {
        score++
        break
      }
    }
  }
  return score
}
