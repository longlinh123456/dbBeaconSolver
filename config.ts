import {MessageEmbed} from "discord.js"

export const config = {
	guildId: "891337964943183912", // guild where the bot is in
	clientId: "891331514376282122", // client token
	defaultEmbed() {
		return new MessageEmbed()
			.setColor("BLUE")
			.setAuthor({name: "Starscape Beacon Solver", iconURL: "https://i.imgur.com/vNUqpKcl.png"})
			.setTimestamp()
			.setThumbnail("https://i.imgur.com/vNUqpKcl.png")
			.setFooter({
				text: "Solving Starscape beacons since 2022", 
				iconURL: "https://i.imgur.com/vNUqpKcl.png"
			})
	},
	defaultEmbedMessage(message, ephemeral = false) {
		return {embeds: [this.defaultEmbed()
			.setDescription(message)],
		ephemeral: ephemeral
		}
	},
}