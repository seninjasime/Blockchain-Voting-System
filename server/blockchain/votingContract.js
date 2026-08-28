require("dotenv").config();

const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  "http://127.0.0.1:8545"
);

const contractAddress =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const abi = [
  "function vote(uint256 _candidateId) public",
  "function addCandidate(string memory _name) public",
  "function getCandidate(uint256 _candidateId) public view returns(uint256,string,uint256)",
  "function candidateCount() public view returns(uint256)"
];

// Get a blockchain contract connected to a specific local Hardhat account
async function getVotingContract(address) {
  const signer = await provider.getSigner(address);

  return new ethers.Contract(
    contractAddress,
    abi,
    signer
  );
}

module.exports = {
  provider,
  getVotingContract,
  contractAddress
};