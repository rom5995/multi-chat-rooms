const router = require("express").Router();
const usersRouter = require("./users.js");

router.use("/", usersRouter);

module.exports = router;
