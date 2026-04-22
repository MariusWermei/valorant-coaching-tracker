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
          num_predict: 400,
          temperature: 0.3,
        },
      }),
    });

    const data = await response.json();

    let text = data.response;
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return { response: text };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = { askLLM };
