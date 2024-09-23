import express from "express";
import crypto from "crypto";
import cors from "cors";
import { WebSocketServer } from "ws";
import { assignRandomStates } from "./public/js/utils.js";

const app = express();
const wss = new WebSocketServer({ port: 8000 });
const PORT = 3000;
const players = [];
const clients = {};

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

class Player {
  constructor(id) {
    this.id = id;
  }

  assignWizard(wizard) {
    this.wizard = wizard;
  }

  setWizardPosition(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
  }

  setIdEnemy(idEnemy) {
    this.idEnemy = idEnemy;
  }

  setState(state) {
    this.state = state;
  }
}

app.get("/join", (req, res) => {
  const id = `${crypto.randomUUID()}`;
  const player = new Player(id);

  players.push(player);

  res.send(id);
});

app.post("/wizard/:playerId", (req, res) => {
  const playerId = req.params.playerId || "";
  const wizardUser = req.body.wizard || "";

  const player = players.find((player) => player.id === playerId);
  player.assignWizard(wizardUser);

  res.end();
});

app.post("/wizard/:playerId/position", (req, res) => {
  const playerId = req.params.playerId || "";
  const positionX = req.body.positionX || 0;
  const positionY = req.body.positionY || 0;

  const player = players.find((player) => player.id === playerId);
  player.setWizardPosition(positionX, positionY);

  const enemies = players.filter((player) => player.id !== playerId);

  res.send({
    enemies,
  });
});

app.post("/enemy/:playerId", (req, res) => {
  const playerId = req.params.playerId || "";
  const enemyId = req.body.enemyId || "";

  const player = players.find((player) => player.id === playerId);
  const enemy = players.find((player) => player.id === enemyId);

  player.setIdEnemy(enemyId);

  if (player.state === undefined && enemy.state === undefined) {
    assignRandomStates(player, enemy);
  }

  res.end();
});

app.get("/player/:playerId/state", (req, res) => {
  const playerId = req.params.playerId || "";

  const player = players.find((player) => player.id === playerId);
  const state = player.state;

  res.send(state);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

wss.on("connection", (ws) => {
  let idPlayer;

  ws.on("message", (data) => {
    const value = JSON.parse(data);
    idPlayer = value && value.data ? value.data.idPlayer : null;
    const attack = value && value.data ? value.data.attack : null;

    if (value.idPlayer !== undefined) {
      clients[value.idPlayer] = ws;
    }

    if (idPlayer) {
      const player = players.find((player) => player.id === idPlayer);
      const idEnemy = player.idEnemy;

      clients[idEnemy].send(JSON.stringify({ type: "attack", attack }));
    }
  });

  ws.on("close", () => {
    delete clients[idPlayer];
  });
});
