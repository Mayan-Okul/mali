// Calls our Netlify Function to get AI-generated insight text.
// Has a hard timeout so a slow/unreachable API can never hang the UI —
// callers should always keep rule-based text as a fallback.

export async function fetchAIInsights(metrics, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('/.netlify/functions/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics),
      signal: controller.signal,
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
