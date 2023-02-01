import { Octokit } from "octokit";

export async function get() {
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  const response = await octokit.request("GET /orgs/cucoderscommunity/public_members{?per_page,page}", {
    org: "ORG",
    per_page: 100
  });
  const members = await response.data;

  return new Response(JSON.stringify(members), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
