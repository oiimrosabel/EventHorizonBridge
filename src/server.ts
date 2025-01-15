import express from "express"
import {checkData, Fetcher, getError, getSuccess} from "./fetch/fetch.main"
import {iCalParser} from "./converter/converter.parser"

const DEFAULT_PORT = 3000
const DEFAULT_TIMEOUT = 10

const app = express()

app.use(express.json())

app.use((req, res, next) => {
        req.setTimeout(DEFAULT_TIMEOUT * 1000, () => {
            res.status(500)
                .send({
                    type: "error",
                    message: "Le serveur a mis trop de temps à répondre",
                    data: {}
                })
                .end()
        })
        next()
    }
)

app.get('/', (_req, res) => {
    res.write('awa')
    res.end()
})

app.get('/api', (_req, res) => {
    res.status(400)
    res.end()
})

app.post('/api', async (req, res) => {
    if (!checkData(req.body)) {
        res.status(400)
            .send(getError("Paramètres manquants ou incorrects."))
            .end()
        return
    }
    const iCalData = await new Fetcher(req.body).fetch()
    if (!iCalData) {
        res.status(500)
            .send(getError("Impossible de récupérer le calendrier."))
            .end()
        return
    }
    const convertedData = new iCalParser(req.body).parseCal(iCalData)
    if (!convertedData) {
        res.status(500)
            .send(getError("Impossible de parser le calendrier."))
            .end()
        return
    }
    res.status(200)
        .send(getSuccess(convertedData))
        .end()
})

app.listen(DEFAULT_PORT)