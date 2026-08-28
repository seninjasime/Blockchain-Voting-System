const API_URL = "http://localhost:3000";

function showRegister() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("registerSection").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
}

async function register() {
    const name = document.getElementById("registerName").value.trim();
    const voterId = document.getElementById("registerVoterId").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!name || !voterId || !password) {
        document.getElementById("registerMessage").textContent =
            "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                voterId,
                password
            })
        });

        const data = await response.json();

        document.getElementById("registerMessage").textContent =
            data.message || data.error;

        if (response.ok) {
            setTimeout(showLogin, 1000);
        }

    } catch (error) {
        console.error("Registration error:", error);

        document.getElementById("registerMessage").textContent =
            "Unable to connect to server.";
    }
}

async function login() {
    const voterId = document.getElementById("loginVoterId").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!voterId || !password) {
        document.getElementById("loginMessage").textContent =
            "Please enter your voter ID and password.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                voterId,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("loginMessage").textContent =
                data.message || data.error;

            return;
        }

        localStorage.setItem("token", data.token);

        showVotingSection();
        await loadCandidates();

    } catch (error) {
        console.error("Login error:", error);

        document.getElementById("loginMessage").textContent =
            "Unable to connect to server.";
    }
}

function showVotingSection() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("registerSection").classList.add("hidden");
    document.getElementById("votingSection").classList.remove("hidden");
}

async function loadVoterStatus() {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            localStorage.removeItem("token");
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error("Voter status error:", error);
        return null;
    }
}

async function loadCandidates() {
    try {
        const voter = await loadVoterStatus();
        const adminSection = document.getElementById("adminSection");

if (adminSection) {
    if (voter?.role === "admin") {
        adminSection.classList.remove("hidden");
    } else {
        adminSection.classList.add("hidden");
    }
}

        const response = await fetch(`${API_URL}/api/candidates`);

        if (!response.ok) {
            throw new Error("Failed to load candidates");
        }

        const candidates = await response.json();

        const container =
            document.getElementById("candidatesContainer");

        container.innerHTML = "";

        candidates.forEach(candidate => {
            const card = document.createElement("div");

            card.className = "candidate";

            const voteButton = voter?.hasVoted
                ? `<button disabled>Already Voted</button>`
                : `<button onclick="vote('${candidate._id}')">Vote</button>`;

            card.innerHTML = `
                <h3>${candidate.symbol || "🗳️"} ${candidate.name}</h3>
                <p>${candidate.party}</p>
                <p>Votes: ${candidate.votes}</p>
                ${voteButton}
            `;

            container.appendChild(card);
        });

        loadResults(candidates);

        const message = document.getElementById("voteMessage");

        if (voter?.hasVoted) {
            message.textContent = "✅ You have already voted.";
        } else {
            message.textContent = "";
        }

    } catch (error) {
        console.error("Candidate loading error:", error);

        document.getElementById("voteMessage").textContent =
            "Unable to load candidates.";
    }
}

function loadResults(candidates) {
    const resultsContainer =
        document.getElementById("resultsContainer");

    const totalVotesElement =
        document.getElementById("totalVotes");

    if (!resultsContainer || !totalVotesElement) {
        return;
    }

    const totalVotes = candidates.reduce(
        (total, candidate) => total + Number(candidate.votes || 0),
        0
    );

    resultsContainer.innerHTML = "";

    candidates.forEach(candidate => {
        const votes = Number(candidate.votes || 0);

        const percentage = totalVotes > 0
            ? ((votes / totalVotes) * 100).toFixed(1)
            : 0;

        const result = document.createElement("div");

        result.className = "result-item";

        result.innerHTML = `
            <div class="result-header">
                <span>
                    ${candidate.symbol || "🗳️"} ${candidate.name}
                </span>

                <span>
                    ${votes} vote${votes === 1 ? "" : "s"}
                </span>
            </div>

            <div class="result-bar">
                <div
                    class="result-fill"
                    style="width: ${percentage}%"
                ></div>
            </div>

            <small>${percentage}%</small>
        `;

        resultsContainer.appendChild(result);
    });

        totalVotesElement.textContent =
        `Total Votes: ${totalVotes}`;
}


// ===============================
// ADMIN: ADD CANDIDATE
// ===============================
async function addCandidate() {
    const token = localStorage.getItem("token");

    const name = document.getElementById("candidateName").value.trim();
    const party = document.getElementById("candidateParty").value.trim();
    const symbol = document.getElementById("candidateSymbol").value.trim();

    const message = document.getElementById("adminMessage");

    if (!name || !party) {
        message.textContent =
            "Candidate name and party are required.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/candidates`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                name,
                party,
                symbol
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.message ||
                data.error ||
                "Failed to add candidate.";

            return;
        }

        message.textContent =
            "✅ Candidate added successfully.";

        document.getElementById("candidateName").value = "";
        document.getElementById("candidateParty").value = "";
        document.getElementById("candidateSymbol").value = "";

        await loadCandidates();

    } catch (error) {
        console.error("Add candidate error:", error);

        message.textContent =
            "Unable to connect to server.";
    }
}


// ===============================
// VOTER: CAST VOTE
// ===============================
async function vote(candidateId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to cast your vote?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/vote`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                candidateId
            })
        });

        const data = await response.json();

        const message =
            document.getElementById("voteMessage");

        if (response.ok) {
            message.textContent =
                `✅ Vote cast successfully for ${data.candidate}.`;

            await loadCandidates();

        } else {
            message.textContent =
                data.message || "Vote failed.";
        }

    } catch (error) {
        console.error("Vote error:", error);

        document.getElementById("voteMessage").textContent =
            "Unable to connect to the voting server.";
    }
}

function logout() {
    localStorage.removeItem("token");

    document.getElementById("votingSection")
        .classList.add("hidden");

    document.getElementById("loginSection")
        .classList.remove("hidden");

    document.getElementById("loginMessage").textContent = "";
    document.getElementById("voteMessage").textContent = "";
}
async function initializeApp() {
    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    const voter = await loadVoterStatus();

    if (voter) {
        showVotingSection();
        await loadCandidates();
    } else {
        localStorage.removeItem("token");
    }
}

document.addEventListener("DOMContentLoaded", initializeApp);