import { createRequestHandler } from "@remix-run/express";
import express from "express";

const port = 3012;

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      })
    );

const app = express();
app.use(
  viteDevServer ? viteDevServer.middlewares : express.static("build/client")
);

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
