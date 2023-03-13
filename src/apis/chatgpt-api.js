import { Configuration, OpenAIApi } from "openai";
import { env } from "../utils/env.js";

const model = "gpt-3.5-turbo";
const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getChatGptResponse(request) {
  try {
    const response = await openai.createChatCompletion({
      model: model,
      messages: [{ role: "user", content: request }],
      stream: false
    });
    // console.log(
    //   "Full response: ",
    //   response,
    //   `Choices: `,
    //   ...response.data.choices
    // );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.log(`ChatGPT error: ` + err);
    return err;
  }
}
