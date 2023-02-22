import Airtable from "airtable";
import axios from "axios";
import dayjs from "dayjs";

export async function post({ request }) {
  const data = await request.json();
  console.log("entro aqui");
  var base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(import.meta.env.AIRTABLE_BASE_ID);

  const record = await base("Table 1").find(data.job);

  const messageTxt = createTelegramMessage(await record.fields);
  const botToken = import.meta.env.TELEGRAM_API_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;
  const dateSlug = dayjs(record.fields.pubDate).format("YYYY-MM-DD");
  const jobUrl = `https://cucoderscommunity.github.io/empleos/${dateSlug}/${record.fields.slug}`;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${messageTxt}&parse_mode=markdown&reply_markup={ "inline_keyboard" : [ [ { "text" : "Ir a la oferta 🔗", "url" : "${jobUrl}" } ] ] }`;
  
  const response = await axios.get(telegramUrl);
  console.log(response.data);

  return new Response(JSON.stringify(response.data), {
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

  if (data.categories && data.categories.length > 0) {
    messageText += `\n#${data.categories.join(" #")} \n`;
  }

  return encodeURIComponent(messageText);
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
}

