const PlayerStats = require("../models/players");
const { computeAnalysis } = require("../services/analysis");
const { askLLM } = require("../services/llm");
const { buildFullCoachingPrompt } = require("../services/prompts");

const playerInfos = async (req, res) => {
  try {
    const playerInfos = await PlayerStats.find(
      {},
      { playerId: 1, riotTag: 1, displayName: 1, profileType: 1, notes: 1 },
    );

    return res.json({ result: true, data: playerInfos });
  } catch (error) {
    return res.status(500).json({ result: false, error: error.message });
  }
};

const singlePlayerInfo = async (req, res) => {
  try {
    const playerId = req.params.playerId;

    const data = await PlayerStats.findOne({
      playerId: playerId,
    });
    if (!data) {
      res.status(404).json({ result: false, message: "User not found" });
    } else {
      res.json({ result: true, data: data });
    }
  } catch (error) {
    return res.status(500).json({ result: false, error: error.message });
  }
};

const playerMatchesInfos = async (req, res) => {
  try {
    const playerId = req.params.playerId;

    const player = await PlayerStats.findOne({
      playerId: playerId,
    });
    if (!player) {
      return res.status(404).json({ result: false, message: "User not found" });
    }

    let matches = player.matches;

    if (req.query.mode) {
      matches = matches.filter((m) => m.mode === req.query.mode);
    }
    if (req.query.map) {
      matches = matches.filter((m) => m.map === req.query.map);
    }
    if (req.query.agent) {
      matches = matches.filter((m) => m.agent === req.query.agent);
    }

    res.json({ result: true, matches: matches });
  } catch (error) {
    return res.status(500).json({ result: false, error: error.message });
  }
};

const playerAnalysis = async (req, res) => {
  try {
    const playerId = req.params.playerId;

    const player = await PlayerStats.findOne({
      playerId: playerId,
    });
    if (!player) {
      return res.status(404).json({ result: false, message: "User not found" });
    }

    let matches = player.matches;

    const stats = computeAnalysis(matches);

    const prompt = buildFullCoachingPrompt(stats);
    const coaching = await askLLM(prompt);

    let parsedCoaching;
    try {
      parsedCoaching = JSON.parse(coaching.response);
    } catch {
      parsedCoaching = coaching.response;
    }

    res.json({ result: true, stats: stats, coaching: parsedCoaching });
  } catch (error) {
    return res.status(500).json({ result: false, error: error.message });
  }
};

module.exports = {
  playerInfos,
  singlePlayerInfo,
  playerMatchesInfos,
  playerAnalysis,
};
