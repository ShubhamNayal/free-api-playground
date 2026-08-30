import { afterEach, describe, expect, it, vi } from "vitest";

import { getAdvice } from "../advice.js";

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getAdvice", () => {
  it("returns the advice slip on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ slip: { id: 42, advice: "Drink more water." } }),
    });

    const res = mockRes();

    await getAdvice({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 42, advice: "Drink more water." });
  });

  it("returns 502 when the payload shape is unexpected", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const res = mockRes();

    await getAdvice({}, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });

  it("returns 502 when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const res = mockRes();

    await getAdvice({}, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });
});
