const express = require("express");
const router = express.Router();
const {
  playerInfos,
  singlePlayerInfo,
  playerMatchesInfos,
  playerAnalysis,
} = require("../controllers/players");

router.get("/players", playerInfos);

router.get("/players/:playerId", singlePlayerInfo);

router.get("/players/:playerId/matches", playerMatchesInfos);

router.get("/players/:playerId/analysis", playerAnalysis);

module.exports = router;
