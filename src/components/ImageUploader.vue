<template>
  <div class="image-uploader">
    <!-- 拍照按钮 -->
    <div class="upload-actions" v-if="!previewUrl">
      <van-button type="primary" round block class="capture-btn" @click="triggerCamera">
        <van-icon name="photograph" size="24" />
        <span class="ml-2">拍照识诗</span>
      </van-button>
      <van-button plain round block class="select-btn" @click="triggerAlbum">
        <van-icon name="photo-o" size="20" />
        <span class="ml-2">从相册选择</span>
      </van-button>
    </div>

    <!-- 预览区 -->
    <div class="preview-area" v-if="previewUrl">
      <img :src="previewUrl" alt="预览" class="preview-image" />
      <div class="preview-actions">
        <van-button size="small" round @click="reset">重新选择</van-button>
        <van-button type="primary" size="small" round @click="confirmImage" :loading="compressing">
          确认使用
        </van-button>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden-input"
      @change="onFileSelected"
    />
    <input
      ref="albumInput"
      type="file"
      accept="image/*"
      class="hidden-input"
      @change="onFileSelected"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { compressImage, fileToBase64 } from '../utils/image.js'

const emit = defineEmits(['ready'])

const cameraInput = ref(null)
const albumInput = ref(null)
const previewUrl = ref('')
const currentFile = ref(null)
const compressing = ref(false)

function triggerCamera() {
  cameraInput.value?.click()
}

function triggerAlbum() {
  albumInput.value?.click()
}

async function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  // 预览原图
  const base64 = await fileToBase64(file)
  previewUrl.value = base64
  currentFile.value = file

  // 清空 input 以便重复选择
  e.target.value = ''
}

async function confirmImage() {
  if (!currentFile.value) return

  compressing.value = true
  try {
    // 压缩图片
    const compressed = await compressImage(currentFile.value, {
      quality: 0.7,
      maxWidth: 1920,
      maxHeight: 1920,
    })
    const base64 = await fileToBase64(compressed)
    emit('ready', { base64, file: compressed })
  } catch (err) {
    console.error('压缩失败，使用原图', err)
    const base64 = await fileToBase64(currentFile.value)
    emit('ready', { base64, file: currentFile.value })
  } finally {
    compressing.value = false
  }
}

function reset() {
  previewUrl.value = ''
  currentFile.value = null
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.hidden-input {
  display: none;
}

.upload-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.capture-btn {
  width: 200px;
  height: 200px !important;
  border-radius: 50% !important;
  background: #8b2c2c !important;
  border-color: #8b2c2c !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.select-btn {
  width: 180px;
  color: #8b2c2c !important;
  border-color: #8b2c2c !important;
}

.preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  object-fit: contain;
}

.preview-actions {
  display: flex;
  gap: 12px;
}
</style>
