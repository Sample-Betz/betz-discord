import { AxiosResponse } from "axios";
import { api } from "./api";
import { ScheduleResponse } from "./dtos";

export const getSchedule = (_sport: string): Promise<ScheduleResponse> => {
    return api.get<ScheduleResponse>("espn/schedule", {
        params: {
            sport: _sport,
        },
    })
    .then((response: AxiosResponse<ScheduleResponse>) => response.data)
    .catch((error) => {
        console.error("Error fetching schedule:", error);
        throw error; 
    });
}