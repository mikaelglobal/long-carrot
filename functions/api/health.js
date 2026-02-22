function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function onRequestGet({ env }) {
  return jsonResponse({
    status: "healthy",
    api_key_set: !!env.DEEPSEEK_API_KEY,
  });
}
