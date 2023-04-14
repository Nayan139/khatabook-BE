require('dotenv').config()
require('./db')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Routes
const auth=require('./routes/authRoutes')

const app = express('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(auth)

const PORT= process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('Server is running on the 8080')
})