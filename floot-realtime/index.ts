type Listener = (data: any) => void;
const channelListeners = new Map<string, Set<Listener>>();
const wsSubscribers = new Map<string, Set<any>>();

export function registerWsClient(ws: any, channel: string) {
  let set = wsSubscribers.get(channel);
  if (!set) {
    set = new Set();
    wsSubscribers.set(channel, set);
  }
  set.add(ws);
}

export function unregisterWsClient(ws: any, channel?: string) {
  if (channel) {
    wsSubscribers.get(channel)?.delete(ws);
  } else {
    for (const set of wsSubscribers.values()) {
      set.delete(ws);
    }
  }
}

export type RealtimePublishResult =
  | { ok: true; delivered: number; error?: undefined }
  | { ok: false; error: { message: string } };

export async function publish(
  channel: string,
  data: any,
): Promise<RealtimePublishResult> {
  let delivered = 0;
  const sockets = wsSubscribers.get(channel);
  if (sockets) {
    const payload = JSON.stringify({ channel, data });
    for (const client of sockets) {
      if (client.readyState === 1 /* OPEN */) {
        try {
          client.send(payload);
          delivered++;
        } catch {
          // Ignore transient write error
        }
      }
    }
  }

  const listeners = channelListeners.get(channel);
  if (listeners) {
    for (const fn of listeners) {
      try {
        fn(data);
      } catch {
        // Ignore listener error
      }
    }
  }

  return { ok: true, delivered };
}

export type RealtimeTokenResult =
  | { ok: true; token: string; wssEndpoint: string; userId: string; error?: undefined }
  | { ok: false; error: { message: string } };

export async function createToken({
  userId,
  channels,
  ttlSeconds = 3600,
}: {
  userId: string;
  channels: string[];
  ttlSeconds?: number;
}): Promise<RealtimeTokenResult> {
  return {
    ok: true,
    token: "tok_" + Math.random().toString(36).slice(2),
    wssEndpoint: "",
    userId,
  };
}

export type RealtimeLastSeenResult =
  | { ok: true; lastSeen: Record<string, number>; error?: undefined }
  | { ok: false; error: { message: string } };

export async function lastSeen(
  channel: string,
  userIds: string[],
): Promise<RealtimeLastSeenResult> {
  const map: Record<string, number> = {};
  const now = Math.floor(Date.now() / 1000);
  for (const id of userIds) {
    map[id] = now;
  }
  return { ok: true, lastSeen: map };
}
