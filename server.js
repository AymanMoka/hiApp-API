const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookie = require('cookie-parser');
require("dotenv").config();


const app = express();
app.use(express.json({}));
app.use(express.urlencoded({}));//parsing

app.use(cookie());//cookie parser

app.use(cors());
app.options("*", cors());//enable cors


mongoose.connect(
  process.env.data_base,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("Database Connected");
  }
);

// connect to db

const authRoute = require("./routes/authRoute");
app.use("/api/v1", authRoute);//auth middleware


const postRoute = require("./routes/postRoute");
app.use("/api/v1", postRoute);//post middleware

app.listen(3000, () => {
  console.log("Server Started");
});
//connect to server
