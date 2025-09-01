const express = require('express');
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000
const expressLayouts = require('express-ejs-layouts');
const static = require("./routes/static")
const app = express();
const indexRoute = require("./routes/indexRoute");
const inventoryRoute = require("./routes/inventoryRoutes")
const errorRoute = require("./routes/errorRoute")
const accountRoute = require("./routes/accountRoute")
const connectDb = require('./mongoDb/dbConnection');
const errorHandler = require('./middleware/errorHandler')
const session = require("express-session")
const flash = require("connect-flash")
const messages = require("express-messages")
const MongoStore = require('connect-mongo');
const initCounters = require('./models/initCounters');

//connect Db
connectDb().then(async () => {
    await initCounters();
})

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTION_STRING, // your MongoDB connection string
    collectionName: 'sessions'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: false // set to true in production with HTTPS
  }
}));


// Flash middleware
app.use(flash())

// Messages middleware
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res)
  next()
})

// Body Parsers
app.use(express.urlencoded({ extended: true })) // for form submissions
app.use(express.json());

//View Engine and Templates
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout') 
app.use(static)

app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})
// Site Routes
app.use('/', indexRoute)

app.use("/inv", inventoryRoute)

app.use("/error", errorRoute)

app.use("/account", accountRoute)

app.use(errorHandler)
app.listen(port, () => {
    console.log(`server runing on port: ${port}`);
});