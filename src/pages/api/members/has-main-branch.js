import { Octokit } from "octokit";

export async function get(params) {
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  const username = params.url.searchParams.get("username");
  var has_main_branch = true;

  const response = await octokit
    .request(`GET /repos/${username}/${username}/branches/main`, {
      owner: username,
      repo: username,
      branch: "main",
    })
    .catch((e) => {
      has_main_branch = false;
    });

    has_main_branch = response.data.name == "main";

  return new Response(JSON.stringify({ has_main_branch: has_main_branch }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
