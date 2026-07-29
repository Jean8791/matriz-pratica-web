import exemplo from "projects/exemplo-projeto/backend/models/exemplo.js";

async function handler(request, response) {
  const data = exemplo.getWelcomeMessage();
  response.status(200).json(data);
}

export default handler;