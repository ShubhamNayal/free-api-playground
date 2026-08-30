const REST_COUNTRIES_URL = "https://restcountries.com/v3.1/name";

/**
 * GET /countries/:name
 * Wraps the REST Countries lookup-by-name endpoint (no API key required).
 */
export async function getCountry(req, res) {
  const { name } = req.params;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Route param 'name' is required." });
  }

  const url = `${REST_COUNTRIES_URL}/${encodeURIComponent(name)}?fields=name,capital,population,region`;

  let response;

  try {
    response = await fetch(url);
  } catch {
    return res.status(502).json({ error: "Failed to reach the country data provider." });
  }

  if (response.status === 404) {
    return res.status(404).json({ error: `No country found matching '${name}'.` });
  }

  if (!response.ok) {
    return res.status(502).json({ error: "Country data provider returned an error." });
  }

  const data = await response.json();
  const matches = Array.isArray(data) ? data : [data];

  return res.status(200).json(
    matches.map((country) => ({
      name: country.name?.common,
      capital: country.capital?.[0] ?? null,
      population: country.population,
      region: country.region,
    })),
  );
}
