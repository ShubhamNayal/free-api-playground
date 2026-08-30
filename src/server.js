import express from "express";

import { getWeather } from "./routes/weather.js";
import { getRandomDog } from "./routes/dog.js";
import { getAdvice } from "./routes/advice.js";
import { getCountry } from "./routes/countries.js";
import { getPost, createPost, createPostBulk } from "./routes/posts.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/weather", getWeather);
  app.get("/dog", getRandomDog);
  app.get("/advice", getAdvice);
  app.get("/countries/:name", getCountry);
  app.get("/posts/:id", getPost);
  app.post("/posts", createPost);
  app.post("/posts/bulk", createPostsBulk);

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  const app = createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`free-api-playground listening on port ${port}`);
  });
}
