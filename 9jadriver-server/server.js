const express = require("express");
const dotenv = require('dotenv')
const connectDB = require('./config/db')
// const mongoose = require("mongoose");
const passport = require("passport");
const path = require('path');
const cors = require('cors');
dotenv.config()

const drivers = require("./routes/api/drivers");


connectDB()

const app = express();

app.use(cors());
// Express-Bodyparser middleware
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

// //Test
// app.get('/', (req, res) => {
//   res.send('Server is Running')
// })

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/drivers", drivers);

//Routes
if (process.env.NODE_ENV === 'production') {
    //Express will serve up production assets
    app.use(express.static(path.join(__dirname, '/client/build')));

    //Express will serve up the index.html file
    //if it doesn't recognize the route i.e Handles any requests that don't match the ones above
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
} else {
  app.get('/', (req, res) => {
    res.send('API is Running...')
  })
}

// app.use(express.static('client/build'));
// app.use(express.static(path.join(__dirname, 'client', 'builf')));

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}!`));
  