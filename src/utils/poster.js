import html2canvas from 'html2canvas'

/**
 * DataURL 转 File 对象
 * @param {string} dataURL - 图片 DataURL
 * @param {string} filename - 文件名
 * @returns {Promise<File>}
 */
export async function dataURLToFile(dataURL, filename = '诗境海报.png') {
  const blob = await (await fetch(dataURL)).blob()
  return new File([blob], filename, { type: 'image/png' })
}

/**
 * DOM 元素导出为图片
 * @param {HTMLElement} element - DOM 元素
 * @param {Object} options - 配置选项
 * @returns {Promise<string>} DataURL
 */
export async function exportPoster(element, options = {}) {
  // 等待字体加载
  await document.fonts.ready

  const canvas = await html2canvas(element, {
    scale: 2, // 高清导出
    useCORS: true,
    backgroundColor: null,
    ...options,
  })

  return canvas.toDataURL('image/png')
}

/**
 * 保存海报到相册
 * @param {string} dataURL - 图片 DataURL
 */
export async function savePoster(dataURL) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // 移动端优先使用 Web Share API，调起系统分享面板（含"保存图片"选项）
  if (isMobile && navigator.share && navigator.canShare) {
    try {
      const file = await dataURLToFile(dataURL)
      const shareData = { title: '诗境·PoeticLens', files: [file] }
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData)
        return
      }
    } catch (err) {
      // 用户取消分享，直接返回
      if (err.name === 'AbortError') return
      // 其他错误，降级处理
    }
  }

  // 降级：使用 <a download> 触发下载
  const link = document.createElement('a')
  link.download = `诗境海报_${Date.now()}.png`
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 分享海报
 * @param {string} dataURL - 图片 DataURL
 */
export async function sharePoster(dataURL) {
  if (navigator.share) {
    try {
      const file = await dataURLToFile(dataURL)
      await navigator.share({
        title: '诗境·PoeticLens',
        text: '我用AI为风景找到了一首古诗',
        files: [file],
      })
    } catch (err) {
      console.log('分享取消或失败', err)
    }
  } else {
    // 不支持 Web Share API
    alert('请长按海报图片保存后分享')
  }
}
