require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
const port = process.env.port;

const server = http.createServer(app);
const io = require("socket.io").listen(server);

const socketHandle = require("./socketHandle");

io.on("connection", async (socket) => {
  const { userId, roomId } = socket.handshake.query;
  console.log("userId", userId);
  console.log("roomId", roomId);

  socket.join(roomId);
  socket
    .in(roomId)
    .emit("is_online", `user ${userId} is connected to the room`);
});

const connection = require("./database");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  connection.query("SELECT roomId, name FROM rooms", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.json(result);
  });
});

app.get("/getRoomHistory/:roomId", (req, res) => {
  if (req.params.roomId) {
    connection.query(
      `Select m.messageId, u.nickname, m.text 
  FROM messages m
  INNER JOIN users u USING (userId) 
  WHERE m.roomId = ${req.params.roomId}`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.json(result);
      }
    );
  } else {
    res.sendStatus(400);
  }
});

app.post("/createNewRoom", (req, res) => {
  if (req.body && req.body.name) {
    const { name } = req.body;
    connection.query(
      `INSERT INTO rooms (name) VALUES('${name}')`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        res.status(200).json(name);
      }
    );
  } else res.sendStatus(400);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
