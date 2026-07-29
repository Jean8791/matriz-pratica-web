function getWelcomeMessage() {
  return {
    project: "exemplo-projeto",
    message: "Módulo de backend funcionando.",
    generated_at: new Date().toISOString(),
  };
}

export default {
  getWelcomeMessage,
};