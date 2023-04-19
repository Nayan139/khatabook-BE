require('dotenv').config()
require('./db')
require('./passport')

const express = require('express')
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser')

//Routes
const auth = require('./routes/authRoutes')
const borrower=require('./routes/borrowerRoutes')

const app = express('cors')

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

app.use(auth)
app.use(borrower)

const PORT= process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('Server is running on the 8080')
})