const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Voter = require("../models/Voter");
const { ethers } = require("ethers");
const { provider } = require("../blockchain/votingContract");

// Register
exports.register = async (req, res) => {
  try {
    const { name, voterId, password } = req.body;

    const existing = await Voter.findOne({ voterId });

    if (existing) {
      return res.status(400).json({
        message: "Voter already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

// Get local Hardhat accounts
const accounts = await provider.send("eth_accounts", []);

// Find which blockchain accounts are already assigned
const existingVoters = await Voter.find({
  blockchainAddress: { $ne: null }
});

const usedAddresses = existingVoters.map(
  voter => voter.blockchainAddress.toLowerCase()
);

// Find the first unused Hardhat account
const availableAddress = accounts.find(
  address => !usedAddresses.includes(address.toLowerCase())
);

if (!availableAddress) {
  return res.status(500).json({
    message: "No blockchain accounts available."
  });
}

const voter = await Voter.create({
  name,
  voterId,
  password: hashedPassword,
  blockchainAddress: availableAddress
});

    res.status(201).json({
      message: "Registration successful",
      voter
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { voterId, password } = req.body;

    const voter = await Voter.findOne({ voterId });

    if (!voter) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(password, voter.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

     const token = jwt.sign(
  {
    id: voter._id,
    role: voter.role
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
exports.getMe = async (req, res) => {
  try {
const voter = await Voter.findById(req.user.id).select(
  "name voterId hasVoted role"
);

    if (!voter) {
      return res.status(404).json({
        message: "Voter not found"
      });
    }

    res.json(voter);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};