import { Octokit } from "octokit";

export async function post({ request }) {
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
        error_message = "Un usuario con esta dirección de correo electrónico ya forma parte de la comunidad.";
      }
      errors = true;
    });

  if (errors) {
    return new Response(JSON.stringify({ error: error_message }), {
      status: 400,
      statusText: "Ocurrio un error creando la invitacion para ese usuario.",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const invitation = await response.data;

  return new Response(JSON.stringify(invitation), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
