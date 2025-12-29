import { Octokit } from "octokit";

export async function POST({ request }) {
  const data = await request.json();
  var errors = false;
  var error_message = "Algo salio mal, por favor vuelve a intentarlo.";
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  const response = await octokit
    .request("POST /orgs/cucoderscommunity/invitations", {
      org: "cucoderscommunity",
      email: data.email,
      role: "direct_member",
    })
    .catch((e) => {
      if (e.status == 422) {
        error_message = "Tu usuario ya es miembro de la comunidad. Para terminar el proceso de registro actualiza tu perfil.";
      }
      errors = true;
    });

  if (errors) {
    return new Response(JSON.stringify({ error: error_message }), {
      status: 400,
      statusText: error_message,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
