import { afterEach, describe, expect, it, vi } from "vitest";

import { getWeather } from "../weather.js";

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getWeather", () => {
  it("returns 400 when lat/lon are missing", async () => {
    const req = { query: {} };
    const res = mockRes();

    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when lat/lon are out of range", async () => {
    const req = { query: { lat: "999", lon: "10" } };
    const res = mockRes();

    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns the current weather on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ current_weather: { temperature: 21.5 } }),
    });

    const req = { query: { lat: "12.97", lon: "77.59" } };
    const res = mockRes();

    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ currentWeather: { temperature: 21.5 } }),
    );
  });

  it("returns 502 when the provider errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const req = { query: { lat: "12.97", lon: "77.59" } };
    const res = mockRes();

    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });

  it("returns 502 when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const req = { query: { lat: "12.97", lon: "77.59" } };
    const res = mockRes();

    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });
});
