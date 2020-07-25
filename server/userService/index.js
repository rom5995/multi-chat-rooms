require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();
const port = process.env.port;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST");
  next();
});

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
