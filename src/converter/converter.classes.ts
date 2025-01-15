import {DateTime} from 'luxon'
import {RTitle} from "./converter.common"

const TIMEZONE_CODE = "Europe/Paris"
const ZERO = "0"
const DEFAULT_ISO = "2000-01-01T00:00Z"

const cleanString = (str: string) => str.trim().replaceAll("\\", "")

export class CDateTime {
    public readonly iso: string
    public readonly date: Date

    public constructor(matches: RegExpExecArray) {
        this.iso = this.convertToISO(matches)
        this.date = this.convertToDate(this.iso)
    }

    public static format(date: Date) {
        return [
            date.getFullYear()
                .toString().padStart(4, ZERO),
            (date.getMonth() + 1)
                .toString().padStart(2, ZERO),
            date.getDate()
                .toString().padStart(2, ZERO),
            ((date.getDay() - 1) % 7)
                .toString()
        ].join('')
    }

    public toDateString() {
        return CDateTime.format(this.date)
    }

    public toTimeString() {
        return [
            this.date.getHours()
                .toString().padStart(2, ZERO),
            this.date.getMinutes()
                .toString().padStart(2, ZERO)
        ].join('')
    }

    private convertToISO(m: RegExpExecArray) {
        return m.length != 6 ? DEFAULT_ISO :
            `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}Z`
    }

    private convertToDate(iso: string) {
        return DateTime
            .fromISO(iso, {zone: 'utc'})
            .setZone(TIMEZONE_CODE)
            .toJSDate()
    }
}

export class CTitle {
    public readonly type: string
    public readonly subject: string

    public constructor(matches: RegExpExecArray) {
        const raw =
            (!matches || matches.length < 2) ? "" : matches[1]
        const res = this.parseSummary(
            cleanString(raw)
        )
        this.type = res[0]
        this.subject = res[1]
    }

    public toResponseTitle(): RTitle {
        return {
            t: this.type,
            s: this.subject
        }
    }

    private parseSummary(raw: string) {
        const matches = /(CM|TD|TP|CC)\d? (.*)/.exec(raw)
        return !matches || matches.length !== 3 ?
            ["", raw]
            : [matches[1], matches[2]]
    }
}

export class CLocation {
    public readonly locations: string[]

    public constructor(matches: RegExpExecArray) {
        const raw =
            (!matches || matches.length < 2) ? "" : matches[1]
        this.locations = this.parseLocations(
            cleanString(raw)
        )
    }

    private parseLocations(raw: string) {
        return raw
            .replaceAll(/ *\([^)]*\)/g, "")
            .split(",")
            .filter((v) => !!v)
    }
}

export class CTeachers {
    public readonly teachers: string[]

    public constructor(matches: RegExpExecArray) {
        const raw =
            (!matches || matches.length < 2) ? "" : matches[1]
        const res = this.parseTeachers(raw)
        res.forEach(cleanString)
        this.teachers = res
    }

    private parseTeachers(raw: string) {
        const upperTest = /^([A-Z]+(?:-[A-Z]+)*(?: [A-Z]+(?:-[A-Z]+)*)+)$/
        return raw
            .split("\\n")
            .filter((v) => upperTest.test(v))
    }
}