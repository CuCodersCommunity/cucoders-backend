import { Octokit } from "octokit";
import { supabase } from "../../../lib/supabase";

export async function post({ request }) {
  const data = await request.json();

  console.log(data);

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
