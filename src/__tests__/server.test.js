import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "../server.js";

describe("server", () => {
  it("responds to GET /health with status ok", async () => {
    const app = createApp();

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
