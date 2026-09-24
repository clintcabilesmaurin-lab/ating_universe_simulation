import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { WebSocketServer } from "ws";
import { registerWsClient, unregisterWsClient } from "./floot-realtime/index";

import * as sessionPOST from "./endpoints/simulation/session_POST";
import * as sessionGET from "./endpoints/simulation/session_GET";
import * as chatPOST from "./endpoints/simulation/chat_POST";
import * as messagesGET from "./endpoints/simulation/messages_GET";
import * as musicPOST from "./endpoints/simulation/music_POST";
import * as tickPOST from "./endpoints/simulation/tick_POST";
import * as worldPOST from "./endpoints/simulation/world_POST";
import * as tokenPOST from "./endpoints/_realtime/token_POST";
import * as sendPOST from "./endpoints/_realtime/send_POST";
import * as lastseenPOST from "./endpoints/_realtime/lastseen_POST";
import * as engineGET from "./endpoints/simulation/engine_GET";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Realtime WebSocket server on /_ws
const wss = new WebSocketServer({ server, path: "/_ws" });
wss.on("connection", (ws) => {
  const subscriptions = new Set<string>();

  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.action === "subscribe" && typeof parsed.channel === "string") {
        subscriptions.add(parsed.channel);
        registerWsClient(ws, parsed.channel);
      } else if (parsed.action === "unsubscribe" && typeof parsed.channel === "string") {
        subscriptions.delete(parsed.channel);
        unregisterWsClient(ws, parsed.channel);
      } else if (parsed.action === "ping") {
        ws.send(JSON.stringify({ action: "pong" }));
      }
    } catch {}
  });

  const cleanup = () => {
    for (const channel of subscriptions) {
      unregisterWsClient(ws, channel);
    }
    subscriptions.clear();
  };

  ws.on("close", cleanup);
  ws.on("error", cleanup);
});

// Endpoint route handlers
const routes: Record<string, Record<string, (req: Request) => Promise<Response>>> = {
  "/_api/simulation/session": {
    GET: sessionGET.handle,
    POST: sessionPOST.handle,
  },
  "/_api/simulation/chat": {
    POST: chatPOST.handle,
  },
  "/_api/simulation/messages": {
    GET: messagesGET.handle,
  },
  "/_api/simulation/music": {
    POST: musicPOST.handle,
  },
  "/_api/simulation/tick": {
    POST: tickPOST.handle,
  },
  "/_api/simulation/world": {
    POST: worldPOST.handle,
  },
  "/_api/simulation/engine-status": {
    GET: engineGET.handle,
  },
  "/_api/_realtime/token": {
    POST: tokenPOST.handle,
  },
  "/_api/_realtime/send": {
    POST: sendPOST.handle,
  },
  "/_api/_realtime/lastseen": {
    POST: lastseenPOST.handle,
  },
};

// API proxy middleware
app.use("/_api", express.text({ type: "*/*" }), async (req, res) => {
  const fullPath = req.baseUrl + req.path;
  const normalizedPath = fullPath.endsWith("/") && fullPath.length > 1 ? fullPath.slice(0, -1) : fullPath;
  const handlers = routes[normalizedPath];
  const handler = handlers?.[req.method];

  if (!handler) {
    res.status(404).json({ error: `Not found: ${req.method} ${normalizedPath}` });
    return;
  }

  try {
    const host = req.get("host") || "localhost:3000";
    const fullUrl = `${req.protocol}://${host}${req.originalUrl}`;
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v) {
        headers.set(k, Array.isArray(v) ? v.join(", ") : v);
      }
    }

    const hasBody = !["GET", "HEAD"].includes(req.method) && req.body;
    const webReq = new Request(fullUrl, {
      method: req.method,
      headers,
      body: hasBody ? (typeof req.body === "string" ? req.body : JSON.stringify(req.body)) : undefined,
    });

    const webRes = await handler(webReq);
    res.status(webRes.status);
    webRes.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });
    const responseText = await webRes.text();
    res.send(responseText);
  } catch (error: any) {
    console.error(`[API Error] ${req.method} ${normalizedPath}:`, error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Vite middleware in dev, static files in production
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

const PORT = 3000;
const HOST = "0.0.0.0";
server.listen(PORT, HOST, () => {
  console.log(`🌌 Ating Universe Simulation running on http://${HOST}:${PORT}`);
});
