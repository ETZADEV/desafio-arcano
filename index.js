import express from "express";
import crypto from "crypto";
import cors from "cors";

const app = express();
const PORT = 3000;
const players = [];

app.use(cors());
app.use(express.json());

class Player {
  constructor(id) {
    this.id = id;
  }

  assignWizard(wizard) {
    this.wizard = wizard;
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

  const index = players.findIndex((player) => player.id === playerId);

  if (index >= 0) {
    players[index].assignWizard(wizardUser);
  }

  res.end();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
