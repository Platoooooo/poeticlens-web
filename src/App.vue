<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

const showTabbar = computed(() => {
  return route.meta.showTabbar !== false
})
</script>

<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-model="active" v-if="showTabbar" route active-color="#8b2c2c" inactive-color="#999">
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/map" icon="map-marked">地图</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
