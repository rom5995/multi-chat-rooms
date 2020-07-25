const router = require("express").Router();
const roomsRouter = require("./rooms.js");

router.use("/", roomsRouter);

module.exports = router;
