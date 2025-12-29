import { Octokit } from "octokit";

export async function GET(params) {
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  const username = params.url.searchParams.get("username");
  var error = false;
  const response = await octokit
    .request("GET /users/" + username, {
      username: username,
    })
    .catch((e) => {
      error = true;
    });

  if (error) {
    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const data = await response.data;

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
