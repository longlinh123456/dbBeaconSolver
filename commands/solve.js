"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const builders_1 = require("@discordjs/builders");
const config_1 = require("../config");
const filter = (message) => message.attachments.keys.length > 0;
exports.command = {
    data: new builders_1.SlashCommandBuilder()
        .setName("solve")
        .setDescription("Solves a beacon.")
        .setDefaultPermission(true),
    async execute(interaction) {
        interaction.reply(config_1.config.defaultEmbedMessage("Please send the beacon image you want to be solved."));
        const messages = await interaction.channel.awaitMessages({
            filter,
            time: 10000,
            max: 1
        });
        messages.forEach(message => console.log(message));
        //const downloadedImage = Buffer.from((await axios.get(imageUrl, {responseType: "arraybuffer"}) as ArrayBuffer))
        //interaction.followUp(config.defaultEmbedMessage(`Matching systems from most likely to least likely:\n${(await (Solver.solve(downloadedImage))).join(", ")}`))
    }
};
