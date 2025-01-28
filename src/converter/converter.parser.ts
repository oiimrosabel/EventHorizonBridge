import type Tokenizr from "tokenizr"
import {formatDate, formatTime, iCalTokens as T, RCalendar, RDay, REvent} from "./converter.common"
import {iCalLexer} from "./converter.lexer"
import {CDateTime, CLocation, CTeachers, CTitle} from "./converter.classes"
import {RequestData} from "../fetch/fetch.commons"

const compAsInt = (s1: string, s2: string) =>
    Number(s1 > s2) - Number(s1 < s2)

export class iCalParser {
    private lexer: Tokenizr
    private readonly now: Date
    private readonly weeks: number

    constructor(request: RequestData) {
        this.lexer = iCalLexer
        this.now = new Date()
        this.weeks = request.weeks
    }

    parseCal(data: string): RCalendar | null {
        this.lexer.input(data)

        let t = this.nextToken()
        if (t.type !== T.VCALSTART) return null

        t = this.nextToken()

        const calMap = new Map<string, RDay>()
        const dayIndex = new Date(this.now)
        for (let _day = 0; _day < this.weeks * 7; _day += 1) {
            if (dayIndex.getDay() !== 0) {
                const dayEDate = formatDate(dayIndex)
                calMap.set(dayEDate, {
                    d: dayEDate,
                    dr: 0,
                    e: [],
                })
            }
            dayIndex.setDate(dayIndex.getDate() + 1)
        }

        while (t.type === T.EVENTSTART) {
            const event = this.parseEvent()
            if (!event) return null
            t = this.nextToken()
            const calDay = calMap.get(event.date ?? "")
            if (calDay) calDay.e.push(event)
        }

        if (t.type !== T.VCALEND) return null

        const calList: RDay[] = []

        for (const day of calMap.values()) {
            day.e.sort((e1, e2) => compAsInt(e1.s, e2.s))
            let duration = 0
            day.e.forEach((e) => {
                duration += e.dr
                e.date = undefined
            })
            day.dr = duration
            calList.push(day)
        }

        return {
            u: {
                dt: `${formatDate(this.now)}${formatTime(this.now)}`,
                w: this.weeks,
            },
            d: calList.sort((d1, d2) => compAsInt(d1.d, d2.d))
        }
    }

    private nextToken() {
        return this.lexer.token()
    }

    private getDuration(date1: CDateTime, date2: CDateTime) {
        return Math.round((date2.date.getTime() - date1.date.getTime()) / (1000 * 60))
    }

    private parseEvent() {
        let t = this.nextToken()
        const res = {} as REvent
        let startDate: CDateTime | null = null
        let endDate: CDateTime | null = null

        while (t.type !== T.EVENTEND) {
            switch (t.type) {
                case T.TIMESTART:
                    startDate = t.value as CDateTime
                    res.date = startDate.toDateString()
                    res.s = startDate.toTimeString()
                    break
                case T.TIMEEND:
                    endDate = t.value as CDateTime
                    res.e = endDate.toTimeString()
                    break
                case T.SUMMARY:
                    res.tt = (t.value as CTitle).toResponseTitle()
                    break
                case T.LOCATION:
                    res.lc = (t.value as CLocation).locations
                    break
                case T.TEACHERS:
                    res.tc = (t.value as CTeachers).teachers
                    break
                default:
                    return null
            }
            t = this.nextToken()
        }
        if (!startDate || !endDate) return null
        res.dr = this.getDuration(startDate, endDate)
        return res
    }
}
