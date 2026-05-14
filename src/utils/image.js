/**
 * 图像压缩/转换工具
 */
import Compressor from 'compressorjs'

/**
 * 压缩图片
 * @param {File} file - 图片文件
 * @param {Object} options - 压缩选项
 * @returns {Promise<File>}
 */
export function compressImage(file, options = {}) {
  const { quality = 0.7, maxWidth = 1920, maxHeight = 1920 } = options

  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxWidth,
      maxHeight,
      success(result) {
        resolve(result)
      },
      error(err) {
        reject(err)
      },
    })
  })
}

/**
 * File 转 Base64
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Base64 转 File
 * @param {string} base64
 * @param {string} filename
 * @returns {File}
 */
export function base64ToFile(base64, filename = 'image.png') {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
