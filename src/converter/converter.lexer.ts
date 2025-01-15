import Tokenizr from "tokenizr"
import {iCalTokens as T} from "./converter.common"
import {CDateTime, CLocation, CTeachers, CTitle} from "./converter.classes"

const iCalLexer = new Tokenizr()

iCalLexer.rule(/BEGIN:VCALENDAR\s+/, (ctx) => {
    ctx.accept(T.VCALSTART)
})

iCalLexer.rule(/END:VCALENDAR\s+/, (ctx) => {
    ctx.accept(T.VCALEND)
})

iCalLexer.rule(/BEGIN:VEVENT\s+/, (ctx) => {
    ctx.accept(T.EVENTSTART)
})

iCalLexer.rule(/END:VEVENT\s+/, (ctx) => {
    ctx.accept(T.EVENTEND)
})

iCalLexer.rule(
    /DTSTART:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{2}Z?\s+/,
    (ctx, match) => {
        ctx.accept(T.TIMESTART, new CDateTime(match))
    },
)

iCalLexer.rule(
    /DTEND:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{2}Z?\s+/,
    (ctx, match) => {
        ctx.accept(T.TIMEEND, new CDateTime(match))
    },
)

iCalLexer.rule(/SUMMARY:(.*)\s+/, (ctx, match) => {
    ctx.accept(T.SUMMARY, new CTitle(match))
})

iCalLexer.rule(/LOCATION:(.*)\s+/, (ctx, match) => {
    ctx.accept(T.LOCATION, new CLocation(match))
})

iCalLexer.rule(/DESCRIPTION:(.*)\s+/, (ctx, match) => {
    ctx.accept(T.TEACHERS, new CTeachers(match))
})

iCalLexer.rule(/.+/, (ctx) => ctx.ignore())

iCalLexer.rule(/\s+/, (ctx) => ctx.ignore())

export {iCalLexer}
