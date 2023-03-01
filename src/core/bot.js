import { Telegraf, Composer } from "telegraf";
import { env } from "../utils/env.js";

const token = env.BOT_TOKEN;
const bot = new Telegraf(token);
const composer = new Composer();
const middleware = (composer => {
  bot.use(composer)
});

bot
  .launch()
  .then(() => console.log("started"))
  .catch((error) => console.error(error));

export { bot, composer, middleware };
