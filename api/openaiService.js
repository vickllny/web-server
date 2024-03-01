const OpenAIApi = require("openai");

//本地开发使用
const { HttpsProxyAgent } = require('https-proxy-agent')
const httpAgent = new HttpsProxyAgent('http://127.0.0.1:7890')


const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
    httpAgent
});

async function chatWithGPT(prompt) {
  try {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
      });
    return completion.choices[0];
  } catch (error) {
    console.error("Error in chatWithGPT:", error);
    throw error;
  }
}

module.exports = { chatWithGPT };