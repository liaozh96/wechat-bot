import { Message } from "wechaty";
import { isNonsense, isProhibited, formatDateStandard } from "./utils.js";
import { submitTask } from "./mj-api.js";

export class Bot {
    botName: string = "MJBOT";
    setBotName(botName: string) {
        this.botName = botName;
    }

    async onMessage(message: Message) {
        const date = message.date();
        const rawText = message.text();
        const talker = message.talker();
        const room = message.room();
        if (!room) {
            return;
        }
        const topic = await room.topic();
        if (isNonsense(talker, message.type(), rawText)) {
            return;
        }
        if (rawText == '/help') {
            const result = "欢迎使用MJ机器人\n" +
                "------------------------------\n"
                + "🎨 生成图片命令\n"
                + "输入: /imagine prompt\n"
                + "prompt 即你向mj提的绘画需求\n"
                + "------------------------------\n"
                + "🌈 变换图片命令\n"
                + "输入: /up 3214528596600076 U1\n"
                + "输入: /up 3214528596600076 V1\n"
                + "3214528596600076代表任务ID，U代表放大，V代表细致变化，1代表第1张图\n"
                + "------------------------------\n"
                + "📕如果你还不会画，赶紧去听课，结合老师准备的提示词手册使用效果更佳 \n"
                + "听课链接https://ndf.xet.tech/s/3gGLLX\n"
            await room.say(result);
            return;
        }
        const talkerName = talker.name();
        console.log(`${formatDateStandard(date)} - [${topic}] ${talkerName}: ${rawText}`);
        if (!rawText.startsWith('/imagine ') && !rawText.startsWith('/up ')) {
            return;
        }
        if (isProhibited(rawText)) {
            const content = `@${talkerName} \n❌ 任务被拒绝，可能包含违禁词`;
            await room.say(content);
            console.log(`${formatDateStandard(date)} - [${topic}] ${this.botName}: ${content}`);
            return;
        }
        let errorMsg;
        if (rawText.startsWith('/up ')) {
            const content = rawText.substring(4);
            errorMsg = await submitTask({
                state: topic + ':' + talkerName,
                action: "UV",
                content: content,
                notifyHook: "http://47.236.20.243:4120/notify"
            });
        } else if (rawText.startsWith('/imagine ')) {
            const prompt = rawText.substring(9);
            errorMsg = await submitTask({
                state: topic + ':' + talkerName,
                action: "IMAGINE",
                prompt: prompt,
                notifyHook: "http://47.236.20.243:4120/notify"
            });
        }
        if (errorMsg) {
            const content = `@${talkerName} \n❌ ${errorMsg}`;
            await room.say(content);
            console.log(`${formatDateStandard(date)} - [${topic}] ${this.botName}: ${content}`);
        }
    }

}