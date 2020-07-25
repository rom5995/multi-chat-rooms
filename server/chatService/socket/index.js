const Filter = require("bad-words");
const queries = require("../db/queries");
const filter = new Filter({ placeHolder: "x" });

const socketHandle = (server) => {
  const io = require("socket.io").listen(server);

  const rooms = {};
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    const user = {
      userId,
      nickname: await queries.getUserNicknameById(userId),
    };
    let roomId;

    socket.on("message", (message) => {
      if (message && message.userId && message.text) {
        message.text = filter.clean(message.text);
        io.in(roomId).emit("message", message);
        queries.insertNewMessage(roomId, message);
      }
    });

    socket.on("enter_room", (newRoomId) => {
      if (newRoomId) {
        if (newRoomId != roomId) {
          leaveTheRoom();
        }
        if (rooms.hasOwnProperty(newRoomId)) {
          rooms[newRoomId].push(user);
        } else {
          rooms[newRoomId] = [user];
        }
        roomId = newRoomId;
        socket.join(roomId);
        io.in(roomId).emit("is_online", rooms[roomId]);
      }
    });

    socket.on("new_room", (room) => {
      if (room && room.roomId && room.name) {
        io.emit("new_room", room);
      }
    });

    socket.on("left_room", () => {
      leaveTheRoom();
    });

    socket.on("disconnect", () => {
      leaveTheRoom();
    });

    const leaveTheRoom = () => {
      if (rooms[roomId]) {
        const index = rooms[roomId].indexOf(user);
        if (index >= 0) {
          rooms[roomId].splice(index, 1);
        }

        socket.to(roomId).emit("is_online", rooms[roomId]);
        socket.leave(roomId);
        roomId = undefined;
      }
    };
  });
};

module.exports = {
  socketHandle,
};
