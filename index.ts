import {Client, Intents, MessageAttachment} from "discord.js"
import axios from "axios"
import {Solver} from "./includes/solver"
import {config} from "./config"

(async() => {
	const token = process.env.TOKEN
	const client = new Client({intents: [Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"]})

	client.once("ready", () => {
		console.log("Ready!")
	})

	client.on("messageCreate", async(message) => {
		const imageUrl = (message.attachments.first() as MessageAttachment)?.url
		if (imageUrl) {
			message.channel.send("Received beacon image, solving...")
			const downloadedImage = Buffer.from((await axios.get(imageUrl, {responseType: "arraybuffer"})).data as ArrayBuffer)
			message.channel.send(config.defaultEmbedMessage(`Matching systems from most likely to least likely:\n${(await (Solver.solve(downloadedImage))).join(", ")}`))
		}
	})

	client.login(token)
})()