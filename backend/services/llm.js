const askLLM = async (prompt) => {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5",
        prompt: prompt,
        stream: false,
        keep_alive: "30m",
        options: {
          num_predict: 300,
        },
      }),
    });

    const data = await response.json();

    return { response: data.response };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = { askLLM };
