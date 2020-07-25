const router = require("express").Router();
const roomsRouter = require("./rooms");

router.use("/rooms", roomsRouter);

module.exports = router;
