"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_1 = require("./config");
const commands = [];
const commandFiles = fs_1.default.readdirSync("./commands").filter(file => file.endsWith(".js"));
(async () => {
    for (const file of commandFiles) {
        const { command } = await Promise.resolve().then(() => __importStar(require(`./commands/${file}`)));
        commands.push(command.data.toJSON());
    }
    if (process.env.TOKEN) {
        const rest = new rest_1.REST({ version: "9" }).setToken(process.env.TOKEN);
        rest.put(v9_1.Routes.applicationCommands(config_1.config.clientId), { body: commands })
            .then(() => console.log("Successfully registered application commands."))
            .catch(console.error);
    }
    else
        throw new Error("TOKEN environmental variable is not defined.");
})();
