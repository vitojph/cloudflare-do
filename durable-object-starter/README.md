# Durable Object starter

A Cloudflare Worker that greets a visitor and counts their visits. Each name is its own [Durable Object](https://developers.cloudflare.com/durable-objects/). The count is stored in that object's storage.

## Run

```sh
npm install
npm run dev
```

Open [http://localhost:8787/](http://localhost:8787/). The default name is `world`.

```text
http://localhost:8787/?name=ada
```

The response includes today's date in `America/New_York` and that name's visit count. Refreshing the same name increments only that counter.

`/favicon.ico` returns 404 and is not counted.

## Deploy

```sh
npm run deploy
```

After changing bindings in `wrangler.jsonc`, regenerate types:

```sh
npm run cf-typegen
```

The Durable Object class is `DumbExample`. The binding is `DUMB_EXAMPLE`. The class uses SQLite storage (`new_sqlite_classes` in `wrangler.jsonc`).
