import axios from "axios";

export async function post({ request }) {
  const data = await request.json();

  const botToken = import.meta.env.TELEGRAM_API_TOKEN;
  const chatId = import.meta.env.TELEGRAM_REPORT_CHAT_ID;
  const text = encodeURIComponent(`
${data.description}

${data.url}
  `);
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=markdown`;
  const response = await axios.get(telegramUrl);

  return new Response(JSON.stringify(response.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
