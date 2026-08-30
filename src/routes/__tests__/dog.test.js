import { afterEach, describe, expect, it, vi } from "vitest";

import { getRandomDog } from "../dog.js";

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getRandomDog", () => {
  it("returns the image URL on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", message: "https://dog.ceo/img/lab.jpg" }),
    });

    const res = mockRes();

    await getRandomDog({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ imageUrl: "https://dog.ceo/img/lab.jpg" });
  });

  it("returns 502 when the provider reports failure status", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "error" }),
    });

    const res = mockRes();

    await getRandomDog({}, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });

  it("returns 502 when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const res = mockRes();

    await getRandomDog({}, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });
});
