import { supabase } from "../../../lib/supabase";

export async function del({ request }) {
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

  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
