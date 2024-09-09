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

var assetPath = require('path').join(__dirname, '../../../assets/');
const image_map = {
    nfl: `${assetPath}/nfl_logo.png`,
    nba: `${assetPath}/nba_logo.png`,
    mlb: `${assetPath}/mlb_logo.png`,
    nhl: `${assetPath}/nhl_logo.png`,
};

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

	const schedule: ScheduleResponse = await getSchedule(sport);
	const formattedSchedule: EmbedField[] = _formatScheduleResponse(schedule);

    console.log(image_map[sport]);
    const attachment = new AttachmentBuilder(image_map[sport]);

	const scheduleEmbed = new EmbedBuilder() 
		.setColor("#0099ff")
		.setTitle(`Upcoming ${sport.toUpperCase()} Schedule`)
        .setThumbnail('attachment://nfl_logo.png')
        .setDescription(`Here is the upcoming schedule for ${sport.toUpperCase()}.`)

        .addFields(formattedSchedule.reverse())

		.setTimestamp()
		.setFooter({ text: "Powered by Betz"});

	return interaction.reply({ embeds: [scheduleEmbed], files: [attachment] });
}

// private
function _formatScheduleResponse(schedule: ScheduleResponse): EmbedField[] {
    const result: EmbedField[] = [];

    for (const key in schedule) {
        if (schedule.hasOwnProperty(key)) {
            const game = schedule[key];
			result.push({
				name: `${game.name}`,
				value: `[${game.date}](${game.url}) | ESPN ID: ${game.id}`,
			} as EmbedField);
        }
    }

    return result;
}