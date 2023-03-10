import Airtable from "airtable";
import axios from "axios";
import dayjs from "dayjs";

export async function post({ request }) {
  const data = await request.json();
  var base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(import.meta.env.AIRTABLE_BASE_ID);

  const record = await base("Table 1").find(data.job);

  const messageTxt = createTelegramMessage(await record.fields);
  const botToken = import.meta.env.TELEGRAM_API_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;
  const dateSlug = dayjs(record.fields.pubDate).format("YYYY-MM-DD");
  const jobUrl = `https://www.cucoders.dev/empleos/${dateSlug}/${record.fields.slug}`;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${messageTxt}&parse_mode=markdown&reply_markup={ "inline_keyboard" : [ [ { "text" : "Ir a la oferta π", "url" : "${jobUrl}" } ] ] }`;
  
  const response = await axios.get(telegramUrl);

  return new Response(JSON.stringify(response.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function createTelegramMessage(data) {
  let messageText = `
πΌ *${data.title}*

${truncate(data.description, 250)}

`;

  if (data.salary) messageText += `π΅ ${data.salary} \n`;
  if (data.freelance) messageText += `π§βπ» Freelance \n`;
  if (data.fulltime) messageText += `π§βπ» Tiempo Completo \n`;
  if (data.parttime) messageText += `π§βπ» Tiempo Parcial \n`;

  let locationData = [];
  if (data.remote) locationData.push(`Remoto`);
  if (data.presential) locationData.push(`Presencial`);
  if (data.location) locationData.push(`${data.location}`);

  if (locationData.length > 0) {
    messageText += `π ${locationData.join(" | ")} \n`;
  }
  if (data.relocate) messageText += `βοΈ ReubicaciΓ³n \n`;

  if (data.categories && data.categories.length > 0) {
    messageText += `\n#${data.categories.join(" #")} \n`;
  }

  return encodeURIComponent(messageText);
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
}

