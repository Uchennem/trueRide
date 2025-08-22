const express = require('express');
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000
const expressLayouts = require('express-ejs-layouts');
const static = require("./routes/static")
const app = express();
const indexRoute = require("./routes/indexRoute");
const inventoryRoute = require("./routes/inventoryRoutes")
const errorRoute = require("./routes/errorRoute")
const connectDb = require('./mongoDb/dbConnection');
const errorHandler = require('./middleware/errorHandler')

//connect Db
connectDb();

//View Engine and Templates
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout') 
app.use(static)

// Site Routes
app.use('/', indexRoute)

app.use("/inv", inventoryRoute)

app.use("/error", errorRoute)

app.use(errorHandler)
app.listen(port, () => {
    console.log(`server runing on port: ${port}`);
});