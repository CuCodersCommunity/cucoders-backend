import Airtable from "airtable";
import { Octokit } from "octokit";

export async function post({ request }) {
  const data = await request.json();
  var base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(import.meta.env.AIRTABLE_BASE_ID);
  let airtablePromise = new Promise(function (resolve, reject) {
    base(import.meta.env.AIRTABLE_JOB_TABLE_ID).create(data, function (err, record) {
      if (err) {
        console.log(err);
        resolve("AirtableError");
        return;
      }
      resolve(record.getId());
    });
  });
  const promiseResponse = await airtablePromise;

  if (promiseResponse == "AirtableError")
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });

  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  await octokit.request(
    "POST https://api.github.com/repos/CuCodersCommunity/cucoderscommunity.github.io/actions/workflows/deployJob.yml/dispatches",
    {
      ref: "main",
      inputs: {
        job_id: data.title,
      },
    }
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
