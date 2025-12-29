import { supabase } from "../../../lib/supabase";
import { Octokit } from "octokit";

export async function PUT({ request }) {
  const data = await request.json();
  const { id, ...updates } = data;

  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: "Missing job ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { data: record, error } = await supabase.from("jobs").update(updates).eq("id", id).select().single();

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

    const octokit = new Octokit({
      auth: import.meta.env.GITHUB_TOKEN,
    });
  
    await octokit.request(
      "POST https://api.github.com/repos/CuCodersCommunity/cucoderscommunity.github.io/actions/workflows/rebuildSite.yml/dispatches",
      {
        ref: "main"
      }
    );

  return new Response(JSON.stringify({ ok: true, data: record }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
