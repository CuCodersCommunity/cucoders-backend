import { Octokit } from "octokit";

export async function GET(params) {
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  const username = params.url.searchParams.get("username");
  var is_member = true;

  const response = await octokit
    .request("GET /orgs/cucoderscommunity/members/" + username, {
      org: "ORG",
      username: username,
    })
    .catch((e) => {
      is_member = false;
    });

  return new Response(JSON.stringify({ is_member: is_member }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
