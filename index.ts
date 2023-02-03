import { Bot, Context } from "grammy"
import * as dotenv from "dotenv";

dotenv.config()
type MyContext = Context

// @ts-ignore
const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

const randInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
bot.catch = (err): void => { }
bot.on(":user_shared", async ctx => {
    ctx.deleteMessage();
    var chat = ctx.update.message?.user_shared;
    if (!chat?.user_id) return;
    if (!ctx.from) return;
    if (!ctx.from?.username) {
        ctx.reply("Please Set Up A Username to Use this bot!");
        return;
    }
    var errored: boolean = false;
    await bot.api.getChat(chat?.user_id.toString()).catch((e: Error) => {
        if (e.message == "Call to 'getChat' failed! (400: Bad Request: chat not found)") {
            ctx.reply("*User not started our bot :(*", { parse_mode: "Markdown" });
            errored = true;
            return;
        }
    })

    if (errored) return;
    await bot.api.sendMessage(chat?.user_id.toString(), `<b>Message From User</b>\nHello Please Contact Me @${ctx.from?.username}`, {
        parse_mode: "HTML"
    }).catch((e: Error) => {
        ctx.reply("Cannot Send Message :( " + e.message);
        return;
    });

    ctx.reply("🎉")
    ctx.reply("Sent Successfully!!");

})
bot.command("start", async (ctx) => {
    var request_id = randInt(11111, 99999);
    ctx.reply("This Bot Can Help You To Send Your Username To User for Contacting Your.", {
        reply_markup: {
            keyboard: [
                [{
                    text: "Select User", request_user: {
                        request_id: request_id,
                        user_is_bot: false,
                    }
                }]
            ],
            resize_keyboard: true
        }
    })
})
bot.start({
    onStart: (botInfo) => {
        console.log(`@${botInfo.username} Started !!`);
    },
    drop_pending_updates: true,
});