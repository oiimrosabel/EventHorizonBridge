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
