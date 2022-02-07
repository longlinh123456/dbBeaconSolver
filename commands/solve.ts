import {SlashCommandBuilder} from "@discordjs/builders"
import {Command} from "../typings/command"
import {CommandInteraction, DMChannel, Message} from "discord.js"
import {config} from "../config"
import axios from "axios"
import {Solver} from "../includes/solver"
const filter = (message: Message) => message.attachments.keys.length > 0

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("solve")
		.setDescription("Solves a beacon.")
		.setDefaultPermission(true) as SlashCommandBuilder,
	async execute(interaction: CommandInteraction) {
		interaction.reply(config.defaultEmbedMessage("Please send the beacon image you want to be solved."))
		const messages = await (interaction.channel as DMChannel).awaitMessages({
			filter,
			time: 10000,
			max: 1
		})
		messages.forEach(message => console.log(message))
		//const downloadedImage = Buffer.from((await axios.get(imageUrl, {responseType: "arraybuffer"}) as ArrayBuffer))
		//interaction.followUp(config.defaultEmbedMessage(`Matching systems from most likely to least likely:\n${(await (Solver.solve(downloadedImage))).join(", ")}`))
	}
}