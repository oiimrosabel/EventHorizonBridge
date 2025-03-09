import express from "express"
import {checkData, Fetcher, getErrorResponseData, getSuccessResponseData} from "./fetch/fetch.main"
import {iCalParser} from "./converter/converter.parser"
import AdeConfig from "../ade.config.json"

const DEFAULT_PORT = AdeConfig.port
const DEFAULT_TIMEOUT = AdeConfig.timeOut
const DEFAULT_ENDPOINT = AdeConfig.defaultEndpoint

const app = express()

app.use(express.json())

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.header("Access-Control-Allow-Origin", "*");
    next()
})

app.use((req, res, next) => {
    res.setTimeout(DEFAULT_TIMEOUT * 1000, () => {
        req.timedout = true
        res.status(503)
            .send(getErrorResponseData("Le serveur a mis trop de temps à répondre."))
            .end()
        return
    })
    next()
})

app.post(DEFAULT_ENDPOINT, (_, res, next) => {
    res.status(405).end()
    next()
})

app.get(DEFAULT_ENDPOINT, async (req, res, next) => {
    if (!checkData(req.body)) {
        res.status(400)
            .send(getErrorResponseData("Paramètres manquants ou incorrects."))
            .end()
        next()
        return
    }
    const iCalData = await new Fetcher(req.body).fetch()
    if (!iCalData) {
        if (!req.timedout)
            res.status(500)
                .send(getErrorResponseData("Impossible de récupérer le calendrier."))
                .end()
        next()
        return
    }
    const convertedData = new iCalParser(req.body).parseCal(iCalData)
    if (!convertedData) {
        if (!req.timedout)
            res.status(500)
                .send(getErrorResponseData("Impossible de parser le calendrier."))
                .end()
        next()
        return
    }
    if (!req.timedout)
        res.status(200)
            .send(getSuccessResponseData(convertedData))
            .end()
    next()
})

app.listen(DEFAULT_PORT)