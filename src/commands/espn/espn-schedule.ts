import { 
    AttachmentBuilder,
	CacheType, 
	CommandInteraction, 
	CommandInteractionOptionResolver, 
	EmbedBuilder, 
	EmbedField, 
	SlashCommandBuilder } from "discord.js";
import { getSchedule } from "../../services/espn-api";
import { ScheduleResponse } from "../../services/dtos";
import { formatScheduleResponse, getLogo } from "../utils";

const sports: string[] = ["nfl", "nba", "mlb", "nhl"];

export const data = new SlashCommandBuilder()
  	.setName("schedule")
	.setDescription("Gets the upcoming schedule by sport.")
	.addStringOption(option =>
		option.setName("sport")
			.setDescription("The sport to get the schedule for.")
			.setRequired(true)
            .addChoices(
                ...sports.map(sport => ({
                    name: sport.toUpperCase(), 
                    value: sport 
                }))
            )
	);

export async function execute(interaction: CommandInteraction) {
	// Get the sport from the interaction
	const sport: string = (interaction.options as CommandInteractionOptionResolver<CacheType>).getString("sport")!;

    // Get the schedule for the sport from the Betz API
	const schedule: ScheduleResponse = await getSchedule(sport.toLowerCase());

    // Format the schedule response
	const formattedSchedule: EmbedField[] = formatScheduleResponse(schedule);
    const attachment = new AttachmentBuilder(getLogo(sport));

	const scheduleEmbed = new EmbedBuilder() 
		.setColor("#0099ff")
		.setTitle(`Upcoming ${sport.toUpperCase()} Schedule`)
        .setThumbnail(`attachment://${sport}_logo.png`)
        .setDescription(`Here is the upcoming schedule for ${sport.toUpperCase()}.`)
        .addFields(formattedSchedule.reverse())
		.setTimestamp()
		.setFooter({ text: "Powered by Betz"});

	return interaction.reply({ embeds: [scheduleEmbed], files: [attachment] });
}