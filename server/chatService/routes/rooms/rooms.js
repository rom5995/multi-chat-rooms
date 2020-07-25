const router = require("express").Router();
const { queries } = require("../../db");
const Filter = require("bad-words");
const filter = new Filter({ placeHolder: "x" });

router.get("/", async (req, res) => {
  const result = await queries.getAllRooms();
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(500);
  }
});

router.get("/getRoomHistory/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  if (roomId) {
    const result = await queries.getRoomHistory(roomId);

    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/createNewRoom", async (req, res) => {
  if (req.body && req.body.name) {
    const { name } = req.body;
    const filteredName = filter.clean(name);

    if (name == filteredName) {
      const result = await queries.insertNewRoom(name);

      if (result) {
        res.json(result);
      } else {
        res.sendStatus(500);
      }
    } else res.sendStatus(403);
  } else res.sendStatus(400);
});

module.exports = router;
