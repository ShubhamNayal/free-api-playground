const ADVICE_API_URL = "https://api.adviceslip.com/advice";

/**
 * GET /advice
 * Wraps the Advice Slip random-advice endpoint (no API key required).
 */
export async function getAdvice(_req, res) {
  let response;

  try {
    response = await fetch(ADVICE_API_URL);
  } catch {
    return res.status(502).json({ error: "Failed to reach the advice provider." });
  }

  if (!response.ok) {
    return res.status(502).json({ error: "Advice provider returned an error." });
  }

  const data = await response.json();

  if (!data.slip || typeof data.slip.advice !== "string") {
    return res.status(502).json({ error: "Advice provider returned an unexpected payload." });
  }

  return res.status(200).json({ id: data.slip.id, advice: data.slip.advice });
}
