import { TranslationServiceClient } from "@google-cloud/translate";
import { env } from "../utils/env.js";

// Instantiates a client
const credentials = JSON.parse(env.GOOGLE_CREDENTIALS);
const projectId = credentials.project_id;
const translationClient = new TranslationServiceClient({
  credentials,
  projectId,
});
const location = "global";

export async function translateTo(lang, str) {
  if (!str.length) return str;

  let from;
  let to;

  if (lang === "en") {
    from = "uz";
    to = "en";
  } else {
    from = "en";
    to = "uz";
  }

  try {
    // skips the translation of a text inside double quotes
    let userText = str;
    const noTranslate = str.match(/"(.*?)"/gi);
    if (!!noTranslate) {
      noTranslate.forEach((el) => {
        userText = str.replace(el, `<span class="notranslate">${el}</span>`);
      });
    }

    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [userText],
      mimeType: "text/html", // mime types: text/plain, text/html
      sourceLanguageCode: from,
      targetLanguageCode: to,
    };

    const [response] = await translationClient.translateText(request);
    let res = response.translations[0].translatedText;
    res = res.replace(/<span class="notranslate">|<\/span>/gi, "");
    return res;
  } catch (err) {
    console.log(`Translate error: ` + err);
    return err;
  }
}
