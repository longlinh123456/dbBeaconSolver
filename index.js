"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const solver_1 = require("./includes/solver");
const config_1 = require("./config");
(async () => {
    const token = process.env.TOKEN;
    const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
    client.once("ready", () => {
        console.log("Ready!");
    });
    client.on("messageCreate", async (message) => {
        const imageUrl = message.attachments.first()?.url;
        if (imageUrl) {
            message.channel.send("Received beacon image, solving...");
            try {
                const downloadedImage = Buffer.from((await axios_1.default.get(imageUrl, { responseType: "arraybuffer" })).data);
                message.channel.send(config_1.config.defaultEmbedMessage(`Matching systems from most likely to least likely:\n${(await (solver_1.Solver.solve(downloadedImage))).join(", ")}`));
            }
            catch {
                message.channel.send({ embeds: [config_1.config.defaultEmbed().setColor("RED").setDescription("Beacon solve failed (probably because you didn't send a beacon)")] });
            }
        }
    });
    client.login(token);
})();
