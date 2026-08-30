import { afterEach, describe, expect, it, vi } from "vitest";

import { getCountry } from "../countries.js";

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getCountry", () => {
  it("returns 400 when name is missing", async () => {
    const req = { params: { name: "" } };
    const res = mockRes();

    await getCountry(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when no country matches", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    const req = { params: { name: "nowhereland" } };
    const res = mockRes();

    await getCountry(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns normalized country data on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          name: { common: "India" },
          capital: ["New Delhi"],
          population: 1400000000,
          region: "Asia",
        },
      ],
    });

    const req = { params: { name: "india" } };
    const res = mockRes();

    await getCountry(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        name: "India",
        capital: "New Delhi",
        population: 1400000000,
        region: "Asia",
      },
    ]);
  });
});
