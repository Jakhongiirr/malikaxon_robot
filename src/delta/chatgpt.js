import { composer, middleware } from "../core/bot.js";
import { getChatGptResponse } from "../apis/chatgpt-api.js";
import { translateTo } from "../apis/google-translate-api.js";
import { cache } from "../core/cache.js";

composer.use(async (ctx) => {
  let obj = {};
  try {
    const userText = ctx.message.text;
    const username =
      ctx.from.username != undefined
        ? "@" + ctx.from.username
        : ctx.from.first_name;

    obj["who"] = `${username}: ${ctx.from.id} *** text: ${ctx.message.text}`;

    /** @Main part: */

    if (cache[`${userText.toLowerCase()}`])
      return ctx.reply(cache[`${userText.toLowerCase()}`]);

    const englishTranslation = await translateTo("en", userText);

    obj["English translation"] = `${englishTranslation}`;

    if (!englishTranslation)
      return ctx.reply(
        `Tarjimada xatolik ro'y berdi, ushbu xatoni albatta tuzatamiz!`
      );
    let chatGptResponse = await getChatGptResponse(englishTranslation);
    console.log(`ChatGPT response: ${chatGptResponse}`)
    if (!chatGptResponse)
      return await ctx.replyWithHTML(
        `Uzr, ushbu sun'iy intellekt algoritmi juda katta miqdorda so'rovlar qabul qilmoqda ` +
          `va hozirda javob bera olmaydi, bu xatoni tuzatish uchun qattiq mehnat qilishmoqda. ` +
          `Iltimos, keyinroq urunib ko'ring, tushunganingiz uchun rahmat!`
      );

    chatGptResponse = chatGptResponse.replace(/\n/gi, "frspce ");
    let uzbekTranslation = await translateTo("uz", chatGptResponse);
    uzbekTranslation = uzbekTranslation.replace(/frspce /gi, "\n");

    obj["Response"] = chatGptResponse;
    obj[`Response translation:`] = `${uzbekTranslation}`;

    if (!uzbekTranslation)
      return ctx.reply(
        `Tarjimada xatolik ro'y berdi, ushbu xatoni albatta tuzatamiz!`
      );

    obj = JSON.stringify(obj);
    console.log(obj);
    return ctx.replyWithHTML(uzbekTranslation, { parse_mode: "HTML" });

    /** return @translation only */
    // const englishTranslation = await translateTo("en", userText);
    // return ctx.replyWithHTML(englishTranslation, { parse_mode: "HTML" });

    /** return @chatgpt response without translation */
    // const chatGptResponse = await getChatGptResponse(userText);
    // return chatGptResponse;
  } catch (err) {
    console.log(err);
    return ctx.reply(
      "Uzr, serverda xatolik ro'y berdi, bu xatolikni tuzatish uchun jamoamiz qattiq " +
        "mehnat qilmoqda, tushunganingiz uchun rahmat!"
    );
  }
});

middleware(composer);
