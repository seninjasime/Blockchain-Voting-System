const Candidate = require("../models/Candidate");
const {
  provider,
  getVotingContract
} = require("../blockchain/votingContract");

// Add Candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, party, symbol } = req.body;

    if (!name || !party) {
      return res.status(400).json({
        message: "Name and party are required"
      });
    }

    // Use Hardhat Account #0 as the election/admin account
const accounts = await provider.send("eth_accounts", []);

if (!accounts.length) {
  return res.status(500).json({
    message: "No blockchain accounts available."
  });
}

const votingContract = await getVotingContract(accounts[0]);

const tx = await votingContract.addCandidate(name);
await tx.wait();

const count = await votingContract.candidateCount();

const candidate = await Candidate.create({
  name,
  party,
  symbol,
  blockchainId: Number(count),
  votes: 0
});

    res.status(201).json({
      message: "Candidate added successfully",
      candidate
    });

  } catch (err) {
    console.error("Add candidate error:", err);

    res.status(500).json({
      error: err.reason || err.message
    });
  }
};

// Get All Candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({
      blockchainId: 1
    });

    res.json(candidates);

  } catch (err) {
    console.error("Get candidates error:", err);

    res.status(500).json({
      error: err.message
    });
  }
};