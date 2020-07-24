require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
const port = process.env.port;

const server = http.createServer(app);
const io = require("socket.io").listen(server);

const socketHandle = require("./socketHandle");

const rooms = {};
io.on("connection", async (socket) => {
  const { userId, roomId } = socket.handshake.query;
  const user = { userId };

  if (rooms.hasOwnProperty(roomId)) {
    rooms[roomId].push(user);
  } else {
    rooms[roomId] = [user];
  }

  socket.join(roomId);
  io.in(roomId).emit("is_online", rooms[roomId]);

  socket.on("message", (message) => {
    if ((message && message.userId, message.text)) {
      io.in(roomId).emit("message", message);
      writeMessageToDB(message, roomId);
    }
  });

  socket.on("disconnect", () => {
    const index = rooms[roomId].indexOf(user);
    if (index >= 0) {
      rooms[roomId].splice(index, 1);
    }
    socket.in(roomId).emit("is_online", rooms[roomId]);
  });
});

const writeMessageToDB = (message, roomId) => {
  connection.query(
    `INSERT INTO messages (roomId, userId, text) VALUES (${roomId},${message.userId},'${message.text}')`,
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
};

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
