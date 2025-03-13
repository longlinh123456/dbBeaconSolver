import fs from "fs"
import {REST} from "@discordjs/rest"
import {Routes} from "discord-api-types/v9"
import {config} from "./config"
import {Command} from "./typings/command"

const commands: Command[] = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

(async() => {
	for (const file of commandFiles) {
		const {command} = await import(`./commands/${file}`)
		commands.push(command.data.toJSON())
	}
	if (process.env.TOKEN) {
		const rest = new REST({version: "9"}).setToken(process.env.TOKEN as string)

		rest.put(Routes.applicationCommands(config.clientId), {body: commands})
			.then(() => console.log("Successfully registered application commands."))
			.catch(console.error)
	} else throw new Error("TOKEN environmental variable is not defined.")
})()