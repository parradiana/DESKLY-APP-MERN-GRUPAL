require('dotenv').config()
const passport = require("passport")
const express = require('express')
const cors = require('cors')
const router = require('./routes/index')
require('./config/database')
const app = express()
require("./config/passport")

app.use(cors())
app.use(express.json())

app.use('/api', router)

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"))
    })
}

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT

app.listen(port, host, () => console.log("App listening on port " + port + "  on " + host))
