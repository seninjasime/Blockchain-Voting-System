// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    uint256 public candidateCount;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event VoteCast(address voter, uint256 candidateId);

    function addCandidate(string memory _name) public {
        candidateCount++;

        candidates[candidateCount] = Candidate(
            candidateCount,
            _name,
            0
        );
    }

    function vote(uint256 _candidateId) public {

        require(!hasVoted[msg.sender], "You have already voted.");

        require(
            _candidateId > 0 &&
            _candidateId <= candidateCount,
            "Invalid candidate."
        );

        hasVoted[msg.sender] = true;

        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function getCandidate(
        uint256 _candidateId
    )
        public
        view
        returns (
            uint256,
            string memory,
            uint256
        )
    {
        Candidate memory c = candidates[_candidateId];

        return (
            c.id,
            c.name,
            c.voteCount
        );
    }
}