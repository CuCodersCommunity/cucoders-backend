import { Octokit } from "octokit";
import { supabase } from "../../../lib/supabase";

export const OPTIONS = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

export async function POST({ request }) {
  const data = await request.json();

  const { data: record, error } = await supabase.from("jobs").insert(data).select().single();

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // const octokit = new Octokit({
  //   auth: import.meta.env.GITHUB_TOKEN,
  // });

  // await octokit.request(
  //   "POST https://api.github.com/repos/CuCodersCommunity/cucoderscommunity.github.io/actions/workflows/deployJob.yml/dispatches",
  //   {
  //     ref: "main",
  //     inputs: {
  //       job_id: record.id.toString(),
  //     },
  //   }
  // );

  return new Response(JSON.stringify({ ok: true, data: record }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
