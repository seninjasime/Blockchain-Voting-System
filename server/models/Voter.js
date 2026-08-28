const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    voterId: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
  type: String,
  enum: ["voter", "admin"],
  default: "voter",
},

    hasVoted: {
      type: Boolean,
      default: false,
    },

    blockchainAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voter", voterSchema);