import {SlashCommandBuilder} from "@discordjs/builders"
export interface Command {
	readonly data: SlashCommandBuilder
	readonly execute: function
	readonly permissions?: CommandPermission[]
}