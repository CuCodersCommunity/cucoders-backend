import { supabase } from "../../../lib/supabase";

export async function GET({ request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: "Missing job ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  let { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    const message = error.code === "PGRST116" ? "Job not found" : error.message;

    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
