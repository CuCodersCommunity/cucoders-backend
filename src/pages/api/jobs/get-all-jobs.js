import Airtable from "airtable";

export async function get() {
  var base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(import.meta.env.AIRTABLE_BASE_ID);
  var data = [];

  const records = await base("Table 1").select().all();
  records.forEach(function (record) {
    data.push(record.fields);
  });

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
