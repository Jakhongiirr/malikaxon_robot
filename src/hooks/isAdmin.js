import { env } from "../utils/env.js";

export function isAdmin(ctx, next) {
    let admins = env.ADMIN_LIST.replace(/\[|\]/gi, '').split(',');
    admins = admins.map(el => parseInt(el));
    if (ctx.from.id in admins) return next()
    return ctx.reply(`Ushbu bo'lim faqat bot boshqaruvchilari uchun!`)
};
