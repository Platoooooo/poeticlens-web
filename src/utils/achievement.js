/**
 * 成就系统
 * 定义成就列表 + 检测函数
 */

export const ACHIEVEMENTS = [
  {
    id: 'first_poem',
    name: '初见诗境',
    desc: '完成第一次拍照识诗',
    icon: '🌸',
    check: (records) => records.length >= 1,
  },
  {
    id: 'four_seasons',
    name: '四季行吟',
    desc: '集齐春夏秋冬四个季节',
    icon: '🏵️',
    check: (records) => {
      const seasons = new Set(records.map((r) => r.analysis?.season).filter(Boolean))
      return ['春', '夏', '秋', '冬'].every((s) => seasons.has(s))
    },
  },
  {
    id: 'moon_poet',
    name: '望月诗人',
    desc: '拍摄 3 次月相关场景',
    icon: '🌙',
    check: (records) => {
      const moonCount = records.filter((r) => {
        const tags = [
          ...(r.analysis?.objects || []),
          ...(r.analysis?.keywords || []),
        ]
        return tags.some((t) => t.includes('月') || t.includes('夜'))
      }).length
      return moonCount >= 3
    },
  },
  {
    id: 'mountain_water',
    name: '山水行者',
    desc: '打卡 5 处山水场景',
    icon: '⛰️',
    check: (records) => {
      const swCount = records.filter((r) => {
        const tags = [
          ...(r.analysis?.objects || []),
          ...(r.analysis?.keywords || []),
        ]
        return tags.some((t) => t.includes('山') || t.includes('水') || t.includes('江') || t.includes('湖'))
      }).length
      return swCount >= 5
    },
  },
  {
    id: 'poet_ten',
    name: '诗境常客',
    desc: '完成 10 次拍照识诗',
    icon: '📜',
    check: (records) => records.length >= 10,
  },
  {
    id: 'poem_collector',
    name: '诗词收藏家',
    desc: '遇见 20 首不同的诗',
    icon: '📚',
    check: (records) => {
      const poemIds = new Set(records.map((r) => r.poem?.id).filter(Boolean))
      return poemIds.size >= 20
    },
  },
]

/**
 * 获取已解锁的成就 ID 列表
 */
export function getUnlockedAchievements() {
  try {
    return JSON.parse(localStorage.getItem('poeticlens_achievements') || '[]')
  } catch {
    return []
  }
}

/**
 * 保存已解锁的成就
 */
export function saveUnlockedAchievements(ids) {
  localStorage.setItem('poeticlens_achievements', JSON.stringify(ids))
}

/**
 * 检查新解锁的成就
 * @param {Array} records - 打卡记录列表
 * @returns {Array} 新解锁的成就列表
 */
export function checkNewAchievements(records) {
  const unlocked = getUnlockedAchievements()
  const newUnlocked = []

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.includes(achievement.id) && achievement.check(records)) {
      newUnlocked.push(achievement)
      unlocked.push(achievement.id)
    }
  }

  if (newUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked)
  }

  return newUnlocked
}

/**
 * 获取所有成就及其解锁状态
 */
export function getAllAchievements() {
  const unlocked = getUnlockedAchievements()
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: unlocked.includes(a.id),
  }))
}
