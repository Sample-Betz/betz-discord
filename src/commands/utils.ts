import { EmbedField } from "discord.js";
import { ScheduleResponse } from "../services/dtos";

export const getLogo = (league: string): string => {
    // Return the path to the logo based on the league
    var assetPath = require('path').join(__dirname, '../assets/');

    const image_map = {
        nfl: `${assetPath}/nfl_logo.png`,
        nba: `${assetPath}/nba_logo.png`,
        mlb: `${assetPath}/mlb_logo.png`,
        nhl: `${assetPath}/nhl_logo.png`,
    };

    return image_map[league];
}

export const formatScheduleResponse = (schedule: ScheduleResponse): EmbedField[] => {
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