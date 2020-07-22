require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.port;

const connection = require("./database");

app.use(bodyParser.json());

app.get("/login", (req, res) => {
  if (req.body && req.body.email) {
    const email = req.body.email;
    connection.query(
      `SELECT nickname FROM users WHERE email='${email}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        } else if (!result.length) {
          res.sendStatus(404);
          return;
        }
        res.json(result);
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
