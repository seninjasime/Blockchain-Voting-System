const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");

dotenv.config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
console.log("Auth routes loaded");
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/vote", voteRoutes);

app.get("/", (req, res) => {
    res.send("Blockchain Voting System API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});