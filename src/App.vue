<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

const showTabbar = computed(() => {
  return route.meta.showTabbar !== false
})

// 页面切换方向
const transitionName = ref('fade-slide')
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <van-tabbar v-model="active" v-if="showTabbar" route active-color="#8b2c2c" inactive-color="#999">
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/map" icon="map-marked">地图</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 通用淡入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease forwards;
}

/* 按钮点击反馈 */
.van-button:active {
  transform: scale(0.96) !important;
  transition: transform 0.1s ease;
}

/* 卡片动画 */
.card-enter {
  animation: fadeInUp 0.4s ease forwards;
}
</style>
