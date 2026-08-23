# Deploy EcoSync to Cloudflare Workers

EcoSync runs as an Express application through Cloudflare Workers' Node.js HTTP compatibility layer. EJS views are pre-bundled for the edge runtime, while files in `public/` are deployed with Workers Static Assets.

## Before the first deployment

The MongoDB credential previously appeared in repository source. Rotate that database user's password in MongoDB Atlas and use only the new connection string for Cloudflare. Removing a credential from the latest commit does not invalidate copies in Git history.

Confirm that the Atlas database user and network access policy allow connections from the deployed Worker.

## Connect the GitHub repository

In **Cloudflare Dashboard → Workers & Pages**:

1. Create or select a Worker named `cs24-p2-django`.
2. Open **Settings → Builds** and connect the GitHub repository.
3. Select the `main` production branch.
4. Use `/` as the root directory.
5. Set the build command to `npm run build`.
6. Set the deploy command to `npm run deploy`.

The Worker name must match the `name` value in `wrangler.toml`.

## Add runtime secrets

Open **Settings → Variables and Secrets → Add**. Add both values as **Secret**, not plain-text variables:

- `MONGODB_URI` — the new MongoDB Atlas connection string created after rotating the database password.
- `SESSION_SECRET` — a new, unpredictable random value of at least 32 characters.

The repository intentionally contains no production secret values. `.env` and `.dev.vars` files are ignored by Git.

You can also add the secrets with Wrangler after authenticating:

```bash
npx wrangler secret put MONGODB_URI
npx wrangler secret put SESSION_SECRET
```

## Local development

Copy `.env.example` to `.env`, then replace the placeholder values. Do not commit `.env`.

Run the standard Node.js server:

```bash
npm start
```

Run in the Cloudflare Workers emulator:

```bash
npm run dev:worker
```

## Validation and deployment

Compile the views and verify the edge template bundle:

```bash
npm run build
npm test
```

Deploy from your machine if needed:

```bash
npm run deploy
```

After deployment, verify:

- `/styles.css` loads successfully.
- The role-selection landing page renders at the Worker URL.
- All three client preview workspaces open without database writes.
- Admin, STS Manager, and Landfill Manager sessions redirect correctly.
- STS data can be written to MongoDB Atlas.
- Landfill reports download as a readable, one-page A4 PDF on mobile and desktop.
