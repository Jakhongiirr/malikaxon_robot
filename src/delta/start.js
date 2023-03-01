import { composer, middleware } from "../core/bot.js";
import { start } from "../layouts/messages.js";

composer.start((ctx) => {
  console.log(`${ctx.from.first_name}: ${ctx.from.id}`);
  return ctx.replyWithHTML(start, { disable_web_page_preview: true });
});

middleware(composer);
