const express = require("express");

const router = express.Router();

const {
  addCandidate,
  getCandidates
} = require("../controllers/candidateController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Only admins can add candidates
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addCandidate
);

// Anyone can view candidates
router.get("/", getCandidates);

module.exports = router;