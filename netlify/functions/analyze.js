/**
 * Netlify Function: 图像识别代理
 * POST /.netlify/functions/analyze
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const { image } = JSON.parse(event.body)
    const apiKey = process.env.DASHSCOPE_API_KEY

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: 'API Key 未配置' }) }
    }

    // 调用通义千问 VL-Max
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-vl-max',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: image } },
              {
                type: 'text',
                text: `请分析这张图片的场景，返回JSON格式：{ "season": "春/夏/秋/冬", "time": "晨/午/昏/夜", "objects": ["主要景物1","主要景物2"], "mood": ["意境词1","意境词2"], "keywords": ["关键词1","关键词2"], "description": "一句话诗意描述" }`,
              },
            ],
          },
        ],
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // 清洗 AI 返回的 JSON（去除 markdown 包裹）
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { statusCode: 200, body: JSON.stringify({ success: false, error: 'AI 返回格式异常', raw: content }) }
    }

    const result = JSON.parse(jsonMatch[0])
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data: result }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    }
  }
}
