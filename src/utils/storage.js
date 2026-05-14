/**
 * localStorage 封装
 */

const PREFIX = 'poeticlens_'

export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.error('localStorage setItem error:', e)
  }
}

export function getItem(key) {
  try {
    const data = localStorage.getItem(PREFIX + key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('localStorage getItem error:', e)
    return null
  }
}

export function removeItem(key) {
  localStorage.removeItem(PREFIX + key)
}
