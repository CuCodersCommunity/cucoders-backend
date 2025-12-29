import { Octokit } from "octokit";

export async function GET() {
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  const pageSize = 100;
  let page = 1;
  let allMembers = [];
  let response = null;

  do {
    response = await octokit.request("GET /orgs/cucoderscommunity/public_members{?per_page,page}", {
      org: "ORG",
      per_page: pageSize,
      page: page,
    });
    allMembers = await allMembers.concat(response.data);
    page++;
  } while (response.data.length == pageSize);

  return new Response(JSON.stringify(allMembers), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
