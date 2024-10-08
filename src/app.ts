import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";

// Create a new Discord client
export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
    console.log("Betz bot is live!");

    // Get list of guides from the client cache
    const guilds = client.guilds.cache;
    guilds.forEach(async (guild) => {
        await deployCommands({ guildId: guild.id });
    });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

// Login to Discord with the bot token
client.login(config.DISCORD_TOKEN);