const connection = require("./connection");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

const getUserNicknameById = async (userId) => {
  let result;
  try {
    result = await query(`SELECT nickname FROM users WHERE userId = ${userId}`);
  } catch (error) {
    console.log(error);
  }
  return result[0].nickname;
};

const getAllRooms = async () => {
  let result;
  try {
    result = await query("SELECT roomId, name FROM rooms");
  } catch (error) {
    console.log(error);
  }
  return result;
};

const getRoomHistory = async (roomId) => {
  let result;
  try {
    const queriesResults = await query(`Select m.messageId, u.nickname, m.text 
      FROM messages m
      INNER JOIN users u USING (userId) 
      WHERE m.roomId = ${roomId};
      SELECT name FROM rooms WHERE roomId = ${roomId}`);
    result = {
      messages: queriesResults[0],
      roomName: queriesResults[1][0].name,
    };
  } catch (error) {
    console.log(error);
  }
  return result;
};

const insertNewRoom = async (name) => {
  let result;
  try {
    const QueryResult = await query(
      `INSERT INTO rooms (name) VALUES('${name}')`
    );

    result = { roomId: QueryResult.insertId, name };
  } catch (error) {
    console.log(error);
  }
  return result;
};

const insertNewMessage = async (roomId, message) => {
  try {
    await query(
      `INSERT INTO messages (roomId, userId, text) VALUES (${roomId},${message.userId},"${message.text}")`
    );
    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

module.exports = {
  getUserNicknameById,
  getAllRooms,
  getRoomHistory,
  insertNewRoom,
  insertNewMessage,
};
