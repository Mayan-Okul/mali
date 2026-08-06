// Netlify Function: securely calls the Anthropic API server-side so the
// API key never reaches the browser. Takes pre-computed shop metrics and
// asks Claude to turn them into short, natural-language insights.

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }),
    };
  }

  try {
    const metrics = JSON.parse(event.body || '{}');

    const prompt = `You are the AI assistant inside Mali, a business operating system for African SME retail shops. You are looking at real computed metrics for a specific shop and writing short, warm, plain-language insights for the owner — as if you are their trusted business advisor, not a report generator. Keep each insight to 1-2 short sentences, concrete and specific to the numbers given. No generic advice, no fluff, no markdown.

Respond with ONLY valid JSON (no markdown fences, no preamble, no trailing text), in exactly this shape:
{
  "profitInsight": "string",
  "reorderInsights": [{"product": "string", "message": "string"}],
  "slowMoverInsight": "string",
  "debtorInsight": "string"
}

Shop metrics:
${JSON.stringify(metrics, null, 2)}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Upstream Anthropic API error', detail }),
      };
    }

    const data = await response.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    const raw = (textBlock && textBlock.text ? textBlock.text : '').trim();
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Model did not return valid JSON', raw }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
