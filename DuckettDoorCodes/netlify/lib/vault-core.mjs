// Stores one encrypted blob. The server never sees the passphrase or any readable codes.
import { createHash } from "node:crypto";

const sha = (s) => createHash("sha256").update(s).digest("hex");
const HEX64 = /^[0-9a-f]{64}$/;
const MAX_BYTES = 300000;

const J = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const validEnvelope = (e) =>
  e &&
  typeof e.salt === "string" &&
  typeof e.iv === "string" &&
  typeof e.ct === "string" &&
  Number.isInteger(e.iter) &&
  e.iter >= 100000 &&
  e.iter <= 5000000;

export function makeHandler(store) {
  return async (req) => {
    const url = new URL(req.url);

    if (req.method === "GET") {
      const raw = await store.get("envelope");
      if (!raw) return J({ empty: true }, 404);
      const env = JSON.parse(raw);
      const since = Number(url.searchParams.get("since"));
      if (url.searchParams.has("since") && since === env.rev) return J({ unchanged: true, rev: env.rev });
      return J({ envelope: env });
    }

    if (req.method === "PUT") {
      const text = await req.text();
      if (text.length > MAX_BYTES) return J({ error: "too large" }, 413);
      let body;
      try { body = JSON.parse(text); } catch { return J({ error: "bad json" }, 400); }
      const { envelope, baseRev, newAuth } = body || {};
      if (!validEnvelope(envelope)) return J({ error: "bad envelope" }, 400);

      const token = req.headers.get("x-auth") || "";
      if (!HEX64.test(token)) return J({ error: "auth" }, 401);

      const storedAuth = await store.get("auth");
      const rawEnv = await store.get("envelope");
      let curRev = 0;
      if (storedAuth) {
        if (sha(token) !== storedAuth) return J({ error: "auth" }, 401);
        curRev = rawEnv ? JSON.parse(rawEnv).rev : 0;
      }
      if (baseRev !== curRev) {
        return J({ conflict: true, envelope: rawEnv ? JSON.parse(rawEnv) : null }, 409);
      }
      if (newAuth !== undefined && newAuth !== null && !HEX64.test(newAuth)) {
        return J({ error: "bad newAuth" }, 400);
      }

      const rev = curRev + 1;
      const { salt, iv, ct, iter } = envelope;
      await store.set("envelope", JSON.stringify({ salt, iv, ct, iter, rev }));
      if (!storedAuth) await store.set("auth", sha(token));
      if (newAuth) await store.set("auth", sha(newAuth));
      return J({ ok: true, rev });
    }

    return J({ error: "method not allowed" }, 405);
  };
}
