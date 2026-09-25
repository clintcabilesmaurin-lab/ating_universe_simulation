import * as sessionPOST from "../endpoints/simulation/session_POST";
import * as sessionGET from "../endpoints/simulation/session_GET";
import * as chatPOST from "../endpoints/simulation/chat_POST";
import * as messagesGET from "../endpoints/simulation/messages_GET";
import * as musicPOST from "../endpoints/simulation/music_POST";
import * as tickPOST from "../endpoints/simulation/tick_POST";
import * as worldPOST from "../endpoints/simulation/world_POST";
import * as tokenPOST from "../endpoints/_realtime/token_POST";
import * as sendPOST from "../endpoints/_realtime/send_POST";
import * as lastseenPOST from "../endpoints/_realtime/lastseen_POST";
import * as engineGET from "../endpoints/simulation/engine_GET";

const routes: Record<
  string,
  Record<string, (req: Request) => Promise<Response>>
> = {
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

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Parse path and match routes
  const parsedUrl = new URL(req.url || "/", "http://localhost:3000");

  let subpath = "";
  const queryParam =
    req.query?.route ||
    req.query?.match ||
    req.query?.path ||
    parsedUrl.searchParams.get("route") ||
    parsedUrl.searchParams.get("match") ||
    parsedUrl.searchParams.get("path");

  if (queryParam) {
    subpath = Array.isArray(queryParam) ? queryParam.join("/") : String(queryParam);
  }

  if (!subpath) {
    const matched =
      req.headers?.["x-matched-path"] ||
      req.headers?.["x-forwarded-uri"] ||
      req.headers?.["x-rewrite-url"] ||
      req.headers?.["x-vercel-matched-path"];
    if (
      typeof matched === "string" &&
      (matched.includes("/simulation/") || matched.includes("/_realtime/"))
    ) {
      subpath = matched;
    }
  }

  if (!subpath) {
    subpath = parsedUrl.pathname;
  }

  // Strip query string and leading slashes
  subpath = subpath.split("?")[0].replace(/^\/+/, "");

  // If subpath is 'api/index', 'api', '_api/index', or '_api', inspect search params again
  if (
    subpath === "api/index" ||
    subpath === "api" ||
    subpath === "_api/index" ||
    subpath === "_api"
  ) {
    const sp =
      parsedUrl.searchParams.get("route") ||
      parsedUrl.searchParams.get("match") ||
      parsedUrl.searchParams.get("path");
    if (sp) {
      subpath = sp.replace(/^\/+/, "");
    }
  }

  // Normalize to standard "/_api/..." format
  let pathname = "/" + subpath;
  if (pathname.startsWith("/api/")) {
    pathname = "/_api/" + pathname.slice(5);
  } else if (!pathname.startsWith("/_api/")) {
    if (pathname.startsWith("/_api")) {
      pathname = "/_api/" + pathname.slice(4).replace(/^\/+/, "");
    } else {
      pathname = "/_api/" + pathname.replace(/^\/+/, "");
    }
  }

  // Clean double slashes and trailing slash
  pathname = pathname.replace(/\/+/g, "/");
  if (pathname.endsWith("/") && pathname.length > 1) {
    pathname = pathname.slice(0, -1);
  }

  const handlers = routes[pathname];
  const methodHandler = handlers?.[req.method || "GET"];

  if (!methodHandler) {
    res.status(404).json({
      error: `Not found: ${req.method} ${pathname}`,
      availableRoutes: Object.keys(routes),
    });
    return;
  }

  try {
    const host = req.headers?.host || "localhost:3000";
    const protocol = req.headers?.["x-forwarded-proto"] || "https";
    const searchParams = new URLSearchParams(parsedUrl.searchParams);
    if (req.query && typeof req.query === "object") {
      for (const [k, v] of Object.entries(req.query)) {
        if (k !== "route" && k !== "match" && k !== "path" && v !== undefined) {
          searchParams.set(k, Array.isArray(v) ? v[0] : String(v));
        }
      }
    }
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const fullUrl = `${protocol}://${host}${pathname}${queryString}`;
    const headers = new Headers();
    if (req.headers) {
      for (const [k, v] of Object.entries(req.headers)) {
        if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : String(v));
      }
    }

    let bodyData: any = undefined;
    if (!["GET", "HEAD"].includes(req.method || "")) {
      if (typeof req.body === "string") {
        bodyData = req.body;
      } else if (req.body && typeof req.body === "object") {
        bodyData = JSON.stringify(req.body);
      } else {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
        }
        bodyData = Buffer.concat(chunks).toString("utf-8");
      }
    }

    const webReq = new Request(fullUrl, {
      method: req.method,
      headers,
      body: bodyData && bodyData.length > 0 ? bodyData : undefined,
    });

    const webRes = await methodHandler(webReq);
    res.status(webRes.status);
    webRes.headers.forEach((val: string, key: string) => {
      res.setHeader(key, val);
    });
    const responseText = await webRes.text();
    res.send(responseText);
  } catch (error: any) {
    console.error(`[Vercel Serverless Error] ${req.method} ${pathname}:`, error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
}
