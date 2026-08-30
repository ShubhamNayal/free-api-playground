# free-api-playground

A small Express service that wraps a handful of free, no-API-key-required public APIs. It exists as a **test bed for [QARA](https://github.com/ShubhamNayal/qara-ai-quality-engineer)** — an AI QA bot that comments on pull requests with affected areas and recommended regression tests.

## Endpoints

| Method | Path              | Wraps                                                              |
| ------ | ----------------- | ------------------------------------------------------------------- |
| GET    | `/health`         | —                                                                    |
| GET    | `/weather`        | [Open-Meteo](https://open-meteo.com/) current weather (`?lat=&lon=`) |
| GET    | `/dog`            | [Dog CEO](https://dog.ceo/dog-api/) random dog image                |
| GET    | `/advice`         | [Advice Slip](https://api.adviceslip.com/) random advice            |
| GET    | `/countries/:name`| [REST Countries](https://restcountries.com/) lookup by name         |
| GET    | `/posts/:id`      | [JSONPlaceholder](https://jsonplaceholder.typicode.com/) fake post  |
| POST   | `/posts`          | JSONPlaceholder fake post creation (write operation)                |

None of these upstream APIs require a key.

## Run locally

```bash
npm install
npm start        # serves on http://localhost:3000
npm test         # runs the vitest suite
```

## QARA setup

This repo already has `.github/workflows/qara.yml`, wired to `ShubhamNayal/qara-ai-quality-engineer@main`. To activate it:

1. Go to **Settings → Secrets and variables → Actions** on this repo.
2. Add a repository secret named `ANTHROPIC_API_KEY` with a valid Anthropic API key.
3. Open a pull request that changes something under `src/` — QARA will comment with affected areas, existing test coverage it found, and any additional regression tests it recommends.

`.github/workflows/ci.yml` runs `npm test` on every PR, independent of QARA.

## Why this repo exists

It's deliberately small and uses well-known keyword categories (write operations via `POST /posts`, external API integrations) so QARA's deterministic risk engine and AI analysis have realistic signal to react to when new endpoints are added in a PR.
