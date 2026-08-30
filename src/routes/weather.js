const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * GET /weather?lat=<number>&lon=<number>
 * Wraps the Open-Meteo current-weather endpoint (no API key required).
 */
export async function getWeather(req, res) {
  const { lat, lon } = req.query;

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (
    lat === undefined ||
    lon === undefined ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    return res.status(400).json({
      error: "Query params 'lat' and 'lon' are required and must be numbers.",
    });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({
      error: "'lat' must be between -90 and 90, 'lon' between -180 and 180.",
    });
  }

  const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  let response;

  try {
    response = await fetch(url);
  } catch {
    return res.status(502).json({ error: "Failed to reach the weather provider." });
  }

  if (!response.ok) {
    return res.status(502).json({ error: "Weather provider returned an error." });
  }

  const data = await response.json();

  return res.status(200).json({
    latitude,
    longitude,
    currentWeather: data.current_weather ?? null,
  });
}
