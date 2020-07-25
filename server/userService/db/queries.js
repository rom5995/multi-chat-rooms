const connection = require("./connection");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

const getUserByEmail = async (email) => {
  let result = [];
  try {
    result = await query(
      `SELECT userId, nickname, email FROM users WHERE email='${email}'`
    );
  } catch (error) {
    console.log(error);
  }
  return result[0];
};

const insertNewUser = async (email, nickname) => {
  let user;
  try {
    const result = await query(
      `INSERT INTO users (email, nickname) VALUES('${email}', '${nickname}')`
    );
    user = {
      userId: result.insertId,
      email,
      nickname,
    };
  } catch (error) {
    console.log(error);
  }
  return user;
};

module.exports = {
  getUserByEmail,
  insertNewUser,
};
