"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const discord_js_1 = require("discord.js");
exports.config = {
    guildId: "891337964943183912",
    clientId: "891331514376282122",
    defaultEmbed() {
        return new discord_js_1.MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: "Starscape Beacon Solver", iconURL: "https://i.imgur.com/vNUqpKcl.png" })
            .setTimestamp()
            .setThumbnail("https://i.imgur.com/vNUqpKcl.png")
            .setFooter({
            text: "Solving Starscape beacons since 2022",
            iconURL: "https://i.imgur.com/vNUqpKcl.png"
        });
    },
    defaultEmbedMessage(message, ephemeral = false) {
        return { embeds: [this.defaultEmbed()
                    .setDescription(message)],
            ephemeral: ephemeral
        };
    },
};
