import { composer, middleware } from "../core/bot.js";

composer.on("edited_message", (ctx) => {
    return ctx.reply(
      "Iltimos, xabarni tahrirlamang, yaxshisi, boshqa xabar yuboring."
    );
  });

  middleware(composer);
