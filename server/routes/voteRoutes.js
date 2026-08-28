const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { castVote } = require("../controllers/voteController");

// Protected route - user must be logged in
router.post("/", authMiddleware, castVote);

module.exports = router;