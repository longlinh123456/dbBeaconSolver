import { Client, IntentsBitField, Partials, Attachment, Colors } from "discord.js"
import axios from "axios"
import {Solver} from "./src/solver"
import {config} from "./config"

(async() => {
	const token = process.env.TOKEN
	const client = new Client({intents: [IntentsBitField.Flags.DirectMessages], partials: [Partials.Channel]})

	client.once("ready", () => {
		console.log("Ready!")
	})

	client.on("messageCreate", async(message) => {
		const imageUrl = (message.attachments.first() as Attachment)?.url
		if (imageUrl) {
			message.channel.send("Received beacon image, solving...")
			try {
				const downloadedImage = Buffer.from((await axios.get(imageUrl, {responseType: "arraybuffer"})).data as ArrayBuffer)
				message.channel.send(config.defaultEmbedMessage(`Matching systems from most likely to least likely:\n${(await (Solver.solve(downloadedImage))).join(", ")}`))
			} catch {
				message.channel.send({embeds: [config.defaultEmbed().setColor(Colors.Red).setDescription("Beacon solve failed (probably because you didn't send a beacon)")]})
			}
		}
	})

	client.login(token)
})()