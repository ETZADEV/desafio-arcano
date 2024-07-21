const attacksList = () => {
  const magd = ["Water Jet", "Freezing"];
  const flamewalker = ["Fireball", "Fire Blaze"];
  const stoneheart = ["Earth Bullets", "Boulder Toss"];
  const whisperwind = ["Slam", "Tornado"];
  const attacks = { magd, flamewalker, stoneheart, whisperwind };

  return attacks;
};

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

const health = (wizard) => {
  const lifeWizards = {
    Magd: 1020,
    Flamewalker: 1033,
    Stoneheart: 1010,
    Whisperwind: 1000,
  };

  return lifeWizards[wizard];
};

const random = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

const colors = (wizard, position) => {
  const gradientColors = {
    Magd: {
      initial: "#003564",
      end: "#016ca0",
    },

    Flamewalker: {
      initial: "#b40e22",
      end: "#dc466b",
    },

    Stoneheart: {
      initial: "#673514",
      end: "#a7551b",
    },

    Whisperwind: {
      initial: "#00967d",
      end: "#00d9b4",
    },
  };

  return gradientColors[wizard][position];
};

export { attacksList, damageWizard, health, random, colors };
