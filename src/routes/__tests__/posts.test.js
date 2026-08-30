import { afterEach, describe, expect, it, vi } from "vitest";

import { getPost, createPost, createPostsBulk } from "../posts.js";

function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getPost", () => {
  it("returns 400 for a non-numeric id", async () => {
    const req = { params: { id: "abc" } };
    const res = mockRes();

    await getPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when the post does not exist", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    const req = { params: { id: "99999" } };
    const res = mockRes();

    await getPost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns the post on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, title: "Hello", body: "World", userId: 1 }),
    });

    const req = { params: { id: "1" } };
    const res = mockRes();

    await getPost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, title: "Hello", body: "World", userId: 1 });
  });
});

describe("createPost", () => {
  it("returns 400 when required fields are missing", async () => {
    const req = { body: { title: "Missing body/userId" } };
    const res = mockRes();

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("creates a post and returns 201 on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 101, title: "New", body: "Post", userId: 1 }),
    });

    const req = { body: { title: "New", body: "Post", userId: 1 } };
    const res = mockRes();

    await createPost(req, res);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/posts"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns 502 when the provider rejects the write", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const req = { body: { title: "New", body: "Post", userId: 1 } };
    const res = mockRes();

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });

  describe("createPostsBulk", () => {
    it("creates multiple posts and returns 207 with per-item results", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 101, title: "New", body: "Post", userId: 1 }),
      });

      const req = {
        body: {
          posts: [
            { title: "A", body: "Post A", userId: 1 },
            { title: "B", body: "Post B", userId: 2 },
          ],
        },
      };
      const res = mockRes();

      await createPostsBulk(req, res);

      expect(res.status).toHaveBeenCalledWith(207);
    });
  });
      it("returns 400 when the posts array exceeds MAX_BULK_SIZE", async () => {
        global.fetch = vi.fn();

        const req = {
          body: {
            posts: Array.from({ length: 21 }, (_, index) => ({
              title: `Post ${index}`,
              body: `Body ${index}`,
              userId: 1,
            })),
          },
        };
        const res = mockRes();

        await createPostsBulk(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(global.fetch).not.toHaveBeenCalled();
      });
});
