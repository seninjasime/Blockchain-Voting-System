#  Blockchain Voting System

A simple blockchain-based voting application I built to learn and demonstrate how blockchain technology can be used in a voting system.

The project combines a web frontend, a Node.js backend, MongoDB, and a Solidity smart contract running on a local Hardhat blockchain.

## What can it do?

- Voters can create an account and log in
- Passwords are securely hashed using bcrypt
- Login is handled using JWT authentication
- Voters can view the available candidates
- Each voter can cast only one vote
- Votes are recorded on the blockchain
- Candidate and voter information is stored in MongoDB
- Admins can add new candidates
- Election results are displayed on the website
- Login sessions remain active after refreshing the page

## Built With

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

**Blockchain**
- Solidity
- Hardhat
- ethers.js

## How the project works

The frontend communicates with the Express backend through API requests.

The backend handles authentication, voter information, and candidate data using MongoDB. When a voter casts a vote, the backend sends the vote to the Solidity smart contract running on the local Hardhat blockchain.

The basic flow looks like this:

```text
Voter
  │
  ▼
Frontend
  │
  ▼
Express API
  │
  ├──────────► MongoDB
  │
  ▼
Solidity Smart Contract
  │
  ▼
Hardhat Blockchain

PROJECT STRUCTURE

Blockchain-Voting-System/
│
├── blockchain/     # Smart contract and Hardhat setup
├── client/         # Frontend
├── server/         # Backend API
├── .gitignore
├── package.json
└── package-lock.json
