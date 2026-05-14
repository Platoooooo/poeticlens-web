/**
 * Netlify Function: 跨时空对话接口
 * POST /.netlify/functions/multi-dynasty
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const { sceneData } = JSON.parse(event.body)
    const apiKey = process.env.DASHSCOPE_API_KEY

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: 'API Key 未配置' }) }
    }

    const prompt = `根据以下场景信息，分别用唐代、宋代、当代三个时代的风格各写一首短诗：${JSON.stringify(sceneData)}
请返回JSON格式：{ "tang": { "title": "", "content": "", "best_line": "" }, "song": { "title": "", "content": "", "best_line": "" }, "modern": { "title": "", "content": "", "best_line": "" } }`

    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

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
