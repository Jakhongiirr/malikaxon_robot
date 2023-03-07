import { Configuration, OpenAIApi } from "openai";
import { env } from "../utils/env.js";

// Curie - less expensive, faster engine - trained until Oct, 2019
const model = "text-davinci-003";
const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getChatGptResponse(request) {
  try {
    const response = await openai.createCompletion({
      model,
      prompt: request,
      max_tokens: 2000,
      temperature: 1,
      stream: false
    });
    // console.log("Full response: ", response, `Choices: `, ...response.data.choices)
    return response.data.choices[0].text;
  } catch (err) {
    console.log(`ChatGPT error: ` + err);
    return err;
  }
}
