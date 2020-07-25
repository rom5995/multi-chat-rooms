const router = require("express").Router();
const { queries } = require("../../db");

router.post("/login", async (req, res) => {
  if (req.body && req.body.email) {
    const email = req.body.email;
    const result = await queries.getUserByEmail(email);

    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  } else res.sendStatus(400);
});

router.post("/register", async (req, res) => {
  if (req.body && req.body.email && req.body.nickname) {
    const { email, nickname } = req.body;
    const result = await queries.insertNewUser(email, nickname);
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(500);
    }
  } else res.sendStatus(400);
});

module.exports = router;
