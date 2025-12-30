import axios from "axios";

export const OPTIONS = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

export async function POST({ request }) {
  const data = await request.json();

  const botToken = import.meta.env.TELEGRAM_API_TOKEN;
  const chatId = import.meta.env.TELEGRAM_REPORT_CHAT_ID;
  const topicId = import.meta.env.TELEGRAM_TOPIC_ID;
  const text = `
${data.description}

${data.url}
  `;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

const response = await axios.post(telegramUrl, {
  chat_id: chatId, // ID del grupo
  text: text,
  parse_mode: 'Markdown',
  message_thread_id: topicId 
});

  return new Response(JSON.stringify(response.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
