export enum iCalTokens {
    VCALSTART = "vcs",
    VCALEND = "vce",
    EVENTSTART = "evs",
    EVENTEND = "eve",
    TIMESTART = "tts",
    TIMEEND = "tte",
    SUMMARY = "sum",
    LOCATION = "loc",
    TEACHERS = "dsc"
}

export interface RTitle {
    t: string
    s: string
}

export interface REvent {
    date?: string
    s: string
    e: string
    dr: number
    tt: RTitle
    lc: string[]
    tc: string[]
}

export interface RDay {
    d: string
    dr: number
    e: REvent[]
}

export interface RLog {
    dt: string
    w: number
}

export interface RCalendar {
    d: RDay[]
    u: RLog
}

const ZERO = "0"

export const formatDate = (date: Date) =>
    [
        date.getFullYear().toString().padStart(4, ZERO),
        (date.getMonth() + 1).toString().padStart(2, ZERO),
        date.getDate().toString().padStart(2, ZERO),
        (Math.abs((date.getDay() - 1) % 7)).toString()
    ].join('')

export const formatTime = (date: Date) =>
    [
        date.getHours().toString().padStart(2, ZERO),
        date.getMinutes().toString().padStart(2, ZERO)
    ].join('')