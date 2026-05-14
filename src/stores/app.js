import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const tabBarActive = ref(0)

  function setLoading(val) {
    loading.value = val
  }

  function setTabBarActive(val) {
    tabBarActive.value = val
  }

  return {
    loading,
    tabBarActive,
    setLoading,
    setTabBarActive,
  }
})
