const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  routes = require("./routes");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("dist"));

app.use(routes);

module.exports = app;
