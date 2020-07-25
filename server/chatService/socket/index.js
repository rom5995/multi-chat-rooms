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
        if (queries.insertNewMessage(roomId, message)) {
          io.in(roomId).emit("message", message);
        }
      }
    });

    socket.on("enter_room", (newRoomId) => {
      if (newRoomId && newRoomId != roomId) {
        leaveTheRoom(newRoomId);

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

    const leaveTheRoom = (newRoomId) => {
      if (roomId && rooms[roomId]) {
        removeUserFromRoom(userId, roomId);
        socket.to(roomId).emit("is_online", rooms[roomId]);
        socket.leave(roomId);
        roomId = undefined;
      } else if (newRoomId && rooms[newRoomId]) {
        removeUserFromRoom(userId, newRoomId);
      }
    };

    const removeUserFromRoom = (userId, roomId) => {
      const index = rooms[roomId].findIndex((u) => u.userId == userId);
      if (index >= 0) {
        rooms[roomId].splice(index, 1);
      }
    };
  });
};

module.exports = {
  socketHandle,
};
