import raioX from "projects/raio-x-rural/backend/models/raioX.js";

async function handler(request, response) {
  const data = raioX.getCalculatorData();
  response.status(200).json(data);
}

export default handler;
