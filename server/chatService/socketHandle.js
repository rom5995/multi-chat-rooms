const socketHandle = async (socket) => {
  const { userId, roomId } = socket.handshake.query;
  console.log("userId", userId);
  console.log("roomId", roomId);

  socket.join(roomId);
  socket
    .in(roomId)
    .emit("is_online", `user ${userId} is connected to the room`);
};

module.exports = socketHandle;
