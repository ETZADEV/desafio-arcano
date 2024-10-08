const damageWizard = (damaged, attacker, attack) => {
  const damage = {
    Magd: {
      Magd: {
        "Water Jet": 300,
        Freezing: 375,
      },
      Flamewalker: {
        Fireball: 475,
        "Fire Blaze": 525,
      },
      Stoneheart: {
        "Earth Bullets": 350,
        "Boulder Toss": 425,
      },
      Whisperwind: {
        Slam: 300,
        Tornado: 375,
      },
    },
    Flamewalker: {
      Magd: {
        "Water Jet": 320,
        Freezing: 450,
      },
      Flamewalker: {
        Fireball: 300,
        "Fire Blaze": 375,
      },
      Stoneheart: {
        "Earth Bullets": 325,
        "Boulder Toss": 400,
      },
      Whisperwind: {
        Slam: 375,
        Tornado: 425,
      },
    },
    Stoneheart: {
      Magd: {
        "Water Jet": 340,
        Freezing: 400,
      },
      Flamewalker: {
        Fireball: 375,
        "Fire Blaze": 440,
      },
      Stoneheart: {
        "Earth Bullets": 300,
        "Boulder Toss": 375,
      },
      Whisperwind: {
        Slam: 350,
        Tornado: 475,
      },
    },
    Whisperwind: {
      Magd: {
        "Water Jet": 350,
        Freezing: 425,
      },
      Flamewalker: {
        Fireball: 375,
        "Fire Blaze": 440,
      },
      Stoneheart: {
        "Earth Bullets": 350,
        "Boulder Toss": 425,
      },
      Whisperwind: {
        Slam: 300,
        Tornado: 375,
      },
    },
  };

  return damage[damaged][attacker][attack];
};

const random = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

const assignRandomStates = (player1, player2) => {
  if (Math.random() < 0.5) {
    player1.setState("waiting");
    player2.setState("attacking");
  } else {
    player1.setState("attacking");
    player2.setState("waiting");
  }
};

export { damageWizard, random, assignRandomStates };
