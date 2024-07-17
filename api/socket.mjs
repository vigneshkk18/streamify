import express from "express";
// import { ViteDevServer } from "vite";

const app = express();

app.get("/api", (req, res) => {
  res.send("Hello world!").end();
});

export function expressPlugin() {
  return {
    name: "express-plugin",
    configureServer(server) {
      server.middlewares.use(app);
    },
  };
}
