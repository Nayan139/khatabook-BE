require('dotenv').config()
require('./db')
require('./passport')

const cookieSession = require("cookie-session");
const session = require('express-session');
const express = require('express')
const cors = require('cors')
// const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser')

//Routes
const auth = require('./routes/authRoutes')
const borrower=require('./routes/borrowerRoutes')
const app = express('cors')

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
      next();
  }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(auth)
app.use(borrower)

const PORT= process.env.PORT || 8080

app.listen(PORT, () => {
    console.log('Server is running on the 8080')
})