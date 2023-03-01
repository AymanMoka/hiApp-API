const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookie = require('cookie-parser');
require("dotenv").config();

const app = express();
//socket.io
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const stream = require("./socket/streams");
stream(io);
//end socket.io


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

const userRoute = require("./routes/userRoute");
app.use("/api/v1", userRoute);//post middleware




httpServer.listen(3000, () => {
  console.log("Server Started");
});
//connect to server
