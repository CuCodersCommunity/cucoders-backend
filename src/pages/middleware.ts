import type { MiddlewareHandler } from "astro";

const ALLOWED_ORIGINS = [
  "http://localhost:4321",
  "https://cucoders.dev",
  "https://www.cucoders.dev",
  "https://cucoders-backend.vercel.app"
];

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const origin = request.headers.get("origin") || "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": isAllowed ? origin : "null",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Vary": "Origin"
      },
    });
  }

  const response = await next();

  response.headers.set("Access-Control-Allow-Origin", isAllowed ? origin : "null");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Vary", "Origin");

  return response;
};
