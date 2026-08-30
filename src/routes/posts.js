const JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * GET /posts/:id
 * Reads a single fake post from JSONPlaceholder.
 */
export async function getPost(req, res) {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Route param 'id' must be a positive integer." });
  }

  let response;

  try {
    response = await fetch(`${JSONPLACEHOLDER_URL}/${id}`);
  } catch {
    return res.status(502).json({ error: "Failed to reach the posts provider." });
  }

  if (response.status === 404) {
    return res.status(404).json({ error: `No post found with id ${id}.` });
  }

  if (!response.ok) {
    return res.status(502).json({ error: "Posts provider returned an error." });
  }

  const data = await response.json();

  return res.status(200).json(data);
}

/**
 * POST /posts
 * Creates a fake post via JSONPlaceholder. This is a write operation used
 * to exercise QARA's deterministic risk signals (write-operation) on this
 * demo repo.
 */
export async function createPost(req, res) {
  const { title, body, userId } = req.body ?? {};

  if (!title || !body || !userId) {
    return res.status(400).json({
      error: "Fields 'title', 'body', and 'userId' are all required.",
    });
  }

  let response;

  try {
    response = await fetch(JSONPLACEHOLDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId }),
    });
  } catch {
    return res.status(502).json({ error: "Failed to reach the posts provider." });
  }

  if (!response.ok) {
    return res.status(502).json({ error: "Posts provider rejected the write." });
  }

  const data = await response.json();

  return res.status(201).json(data);
}
const MAX_BULK_SIZE = 20;

/**
 * POST /posts/bulk
 * Creates multiple fake posts via JSONPlaceholder in a single bulk write.
 * This bulk write operation exercises QARA's bulk-operation and
 * write-operation risk signals on this demo repo.
 */
export async function createPostsBulk(req, res) {
  const { posts } = req.body ?? {};

  if (!Array.isArray(posts) || posts.length === 0) {
    return res.status(400).json({ error: "'posts' must be a non-empty array." });
  }

  if (posts.length > MAX_BULK_SIZE) {
    return res.status(400).json({
      error: `Cannot create more than ${MAX_BULK_SIZE} posts in a single bulk request.`,
    });
  }

  const results = await Promise.all(
    posts.map(async (post) => {
      const { title, body, userId } = post ?? {};

      if (!title || !body || !userId) {
        return { success: false, error: "Missing title, body, or userId." };
      }

      try {
        const response = await fetch(JSONPLACEHOLDER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body, userId }),
        });

        if (!response.ok) {
          return { success: false, error: "Provider rejected the write." };
        }

        const data = await response.json();
        return { success: true, post: data };
      } catch {
        return { success: false, error: "Failed to reach the posts provider." };
      }
    }),
  );

  return res.status(207).json({ results });
}