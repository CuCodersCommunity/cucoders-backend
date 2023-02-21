import { Octokit } from "octokit";

export async function post({ request }) {
  const data = await request.json();

  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });
  await octokit
    .request(
      "POST https://api.github.com/repos/CuCodersCommunity/cucoderscommunity.github.io/actions/workflows/deploy.yml/dispatches",
      {
        ref: "main",
      }
    )
    .then(() => {
      const messageTxt = createTelegramMessage(data);
      const botToken = import.meta.env.TELEGRAM_API_TOKEN;
      const chatId = import.meta.env.TELEGRAM_CHAT_ID;
      const jobUrl = `https://cucoderscommunity.github.io/empleos/${data.pubDate.replace(/\//g, "-")}/${data.slug}`;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${messageTxt}&parse_mode=markdown&reply_markup={ "inline_keyboard" : [ [ { "text" : "Ir a la oferta 🔗", "url" : "${jobUrl}" } ] ] }`;
        fetch(telegramUrl);
    });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function createTelegramMessage(data) {
  let messageText = `
💼 *${data.title}*

${truncate(data.description, 250)}

`;

  if (data.salary) messageText += `💵 ${data.salary} \n`;
  if (data.freelance) messageText += `🧑‍💻 Freelance \n`;
  if (data.fulltime) messageText += `🧑‍💻 Tiempo Completo \n`;
  if (data.parttime) messageText += `🧑‍💻 Tiempo Parcial \n`;

  let locationData = [];
  if (data.remote) locationData.push(`Remoto`);
  if (data.presential) locationData.push(`Presencial`);
  if (data.location) locationData.push(`${data.location}`);

  if (locationData.length > 0) {
    messageText += `📍 ${locationData.join(" | ")} \n`;
  }
  if (data.relocate) messageText += `✈️ Reubicación \n`;

  if (data.categories.length > 0) {
    messageText += `\n#${data.categories.join(" #")} \n`;
  }

  return encodeURIComponent(messageText);
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
}

async function triggerGithubAction(token, repository, workflow) {
  const url = `https://api.github.com/repos/${repository}/actions/workflows/${workflow}/dispatches`;
  const body = { ref: "main" };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  if (response.ok) {
    console.log(`GitHub action "${workflow}" was successfully triggered.`);
  } else {
    console.error(`Failed to trigger GitHub action: ${json.message}`);
  }

  return response;
}
