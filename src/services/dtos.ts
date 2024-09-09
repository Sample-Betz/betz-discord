
export interface Game {
    id: string;
    name: string;
    url: string;
    date: string;
}

export interface ScheduleResponse {
    [key: string]: Game;
}