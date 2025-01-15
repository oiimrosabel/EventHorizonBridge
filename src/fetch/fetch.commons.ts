import {RCalendar} from "../converter/converter.common"

export interface RequestData {
    cal: number,
    weeks: number
}

export interface ResponseData {
    success: boolean,
    message?: string,
    data?: {} | RCalendar
}