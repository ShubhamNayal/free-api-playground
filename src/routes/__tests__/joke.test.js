import { afterEach, describe, expect, it, vi } from "vitest";

import { getJoke } from "../joke.js";

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getJoke", () => {
  it("[HIGH] returns 200 with id, setup, and punchline on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 42,
        type: "general",
        setup: "Why did the developer go broke?",
        punchline: "Because they used up all their cache.",
      }),
    });

    const res = mockRes();

    await getJoke({}, res);

    expect(global.fetch).toHaveBeenCalledWith("https://official-joke-api.appspot.com/random_joke");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 42,
      setup: "Why did the developer go broke?",
      punchline: "Because they used up all their cache.",
    });
  });

  it("[MEDIUM] returns 502 when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const res = mockRes();

    await getJoke({}, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining("Failed to reach the joke provider") }),
    );
  });

  it("[MEDIUM] returns 502 when the upstream responds with a non-OK status", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    const res = mockRes();

    await getJoke({}, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining("Joke provider returned an error") }),
    );
  });
});
