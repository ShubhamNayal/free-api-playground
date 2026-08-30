const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";

/**
 * GET /dog
 * Wraps the Dog CEO random-image endpoint (no API key required).
 */
export async function getRandomDog(_req, res) {
  let response;

  try {
    response = await fetch(DOG_API_URL);
  } catch {
    return res.status(502).json({ error: "Failed to reach the dog image provider." });
  }

  if (!response.ok) {
    return res.status(502).json({ error: "Dog image provider returned an error." });
  }

  const data = await response.json();

  if (data.status !== "success" || !data.message) {
    return res.status(502).json({ error: "Dog image provider returned an unexpected payload." });
  }

  return res.status(200).json({ imageUrl: data.message });
}
