const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");
const { getVotingContract } = require("../blockchain/votingContract");

exports.castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        message: "Candidate ID is required"
      });
    }

    const voter = await Voter.findById(req.user.id);

    if (!voter) {
      return res.status(404).json({
        message: "Voter not found"
      });
    }

    if (voter.hasVoted) {
      return res.status(400).json({
        message: "You have already voted."
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    if (!candidate.blockchainId) {
      return res.status(400).json({
        message: "Candidate is not registered on the blockchain."
      });
    }

    if (!voter.blockchainAddress) {
      return res.status(400).json({
        message: "Voter does not have a blockchain account."
      });
    }

    // Get this voter's blockchain signer
    const votingContract = await getVotingContract(
      voter.blockchainAddress
    );

    // Send vote to blockchain first
    const tx = await votingContract.vote(
      candidate.blockchainId
    );

    console.log("Blockchain transaction:", tx.hash);

    // Wait until blockchain confirms the transaction
    await tx.wait();

    // Only update MongoDB after blockchain succeeds
    candidate.votes += 1;
    await candidate.save();

    voter.hasVoted = true;
    await voter.save();

    res.json({
      message: "Vote cast successfully!",
      transactionHash: tx.hash,
      candidate: candidate.name
    });

  } catch (err) {
    console.error("Voting error:", err);

    res.status(500).json({
      message: "Vote failed.",
      error: err.reason || err.message
    });
  }
};