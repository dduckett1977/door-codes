import { getStore } from "@netlify/blobs";
import { makeHandler } from "../lib/vault-core.mjs";

export default async (req) => {
  const store = getStore({ name: "duckett-vault", consistency: "strong" });
  return makeHandler(store)(req);
};

export const config = { path: "/api/vault" };
