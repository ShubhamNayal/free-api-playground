const JOKE_API_URL = "https://official-joke-api.appspot.com/random_joke";

/**
 * GET /joke
 * Wraps the Official Joke API random-joke endpoint (no API key required).
 *
 * NOTE: intentionally shipped without unit tests, to see how QARA reacts
 * to a new endpoint that lacks coverage.
 */
export async function getJoke(_req, res) {
  let response;

  try {
    response = await fetch(JOKE_API_URL);
  } catch {
    return res.status(502).json({ error: "Failed to reach the joke provider." });
  }

  if (!response.ok) {
    return res.status(502).json({ error: "Joke provider returned an error." });
  }

  const data = await response.json();

  return res.status(200).json({ id: data.id, setup: data.setup, punchline: data.punchline });
}
