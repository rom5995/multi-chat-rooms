require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.port;

const connection = require("./database");

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

app.post("/login", (req, res) => {
  if (req.body && req.body.email) {
    const email = req.body.email;
    connection.query(
      `SELECT userId, nickname FROM users WHERE email='${email}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        } else if (!result.length || result.length > 1) {
          res.sendStatus(404);
          return;
        }
        const user = result[0];
        Object.assign(user, { email });
        res.json(user);
      }
    );
  } else res.sendStatus(400);
});

app.post("/register", (req, res) => {
  if (req.body && req.body.email && req.body.nickname) {
    const { email, nickname } = req.body;
    connection.query(
      `INSERT INTO users (email, nickname) VALUES('${email}', '${nickname}')`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.status(200).json(nickname);
      }
    );
  } else res.sendStatus(400);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
