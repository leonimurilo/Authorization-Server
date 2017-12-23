//Main starting point of the application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");

// DB setup
// creates a new database in mongo called auth
mongoose.connect("mongodb://localhost:27017/auth", {useMongoClient: true});

// middlewares:
// log incoming requests
app.use(morgan("combined"));

// allow cors
app.use(cors());

// extract the request body, turn it into a json and exposes it on req.body
app.use(bodyParser.json({type: "*/*"}));

router(app);

// server setup
const port = process.env.PORT || 3090
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:", port);
