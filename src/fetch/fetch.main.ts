import {RequestData, ResponseData} from "./fetch.commons"
import {RCalendar} from "../converter/converter.common"
import AdeConfig from "../../ade.config.json"

export const getErrorResponseData = (message: string) => (
    {
        success: false,
        message: message,
        data: undefined
    }) as ResponseData

export const getSuccessResponseData = (data: RCalendar) => (
    {
        success: true,
        message: undefined,
        data: data
    }) as ResponseData

export const checkData = (r: any): r is RequestData => {
    const cal = r['cal']
    const weeks = r['weeks']
    return cal
        && weeks
        && typeof cal === 'number'
        && typeof weeks === 'number'
        && /^\d+$/.test(cal.toString())
        && /^\d{1,3}$/.test(weeks.toString())
}

export class Fetcher {
    private readonly url: URL

    public constructor(data: RequestData) {
        this.url = this.setupUrl()
        this.url.searchParams.append("resources", data.cal.toString())
        this.url.searchParams.append("nbWeeks", data.weeks.toString())
    }

    public async fetch() {
        let res: Response
        try {
            res = await fetch(this.url)
        } catch (_) {
            return null
        }
        if (!res.ok) return null
        return (await res.text())
    }

    private setupUrl() {
        const baseUrl = new URL(AdeConfig.adeUrl)
        baseUrl.searchParams.append("projectId", "0")
        baseUrl.searchParams.append("calType", "ical")
        baseUrl.searchParams.append("displayConfigId", "8")
        return baseUrl
    }
}