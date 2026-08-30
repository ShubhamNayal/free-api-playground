import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

import { createApp } from "../server.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("server", () => {
  it("responds to GET /health with status ok", async () => {
    const app = createApp();

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("[LOW] routes GET /joke to the getJoke handler instead of returning 404", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, type: "general", setup: "Setup", punchline: "Punchline" }),
    });

    const app = createApp();

    const response = await request(app).get("/joke");

    expect(response.status).not.toBe(404);
    expect(global.fetch).toHaveBeenCalledWith("https://official-joke-api.appspot.com/random_joke");
  });
});
