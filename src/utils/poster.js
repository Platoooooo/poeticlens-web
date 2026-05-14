import html2canvas from 'html2canvas'

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
export function savePoster(dataURL) {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isIOS) {
    // iOS: 新标签页打开，提示长按保存
    const newTab = window.open('')
    if (newTab) {
      newTab.document.write(`<img src="${dataURL}" style="max-width:100%;" />`)
      newTab.document.title = '长按图片保存'
    }
  } else {
    // Android / PC: 触发下载
    const link = document.createElement('a')
    link.download = `诗境海报_${Date.now()}.png`
    link.href = dataURL
    link.click()
  }
}

/**
 * 分享海报
 * @param {string} dataURL - 图片 DataURL
 */
export async function sharePoster(dataURL) {
  if (navigator.share) {
    try {
      const blob = await (await fetch(dataURL)).blob()
      const file = new File([blob], '诗境海报.png', { type: 'image/png' })
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
