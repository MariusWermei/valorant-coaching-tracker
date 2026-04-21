const mongoose = require("mongoose");

const playerMatchesSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  date: { type: Date, required: true },
  mode: {
    type: String,
    enum: ["competitive", "deathmatch", "swiftplay", "unrated"],
  },
  map: String,
  agent: String,
  result: {
    type: String,
    enum: ["win", "loss"],
  },
  kills: Number,
  deaths: Number,
  assists: Number,
  score: Number,
  roundsWon: Number,
  roundsLost: Number,
});

const playerStatsSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  riotTag: { type: String, required: true },
  displayName: { type: String, required: true },
  profileType: String,
  notes: String,
  matches: [playerMatchesSchema],
});

module.exports = mongoose.model("playerstats", playerStatsSchema);
