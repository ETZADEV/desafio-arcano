const attacksList = () => {
  const magd = ["Burbuja", "Glacial"];
  const flamewalker = ["Llamarada", "Inferno"];
  const stoneheart = ["Pedrisco", "Monolito"];
  const whisperwind = ["Zumbido", "Tornado"];
  const attacks = { magd, flamewalker, stoneheart, whisperwind };

  return attacks;
};

const damageWizard = (damaged, attacker, attack) => {
  const damage = {
    Magd: {
      Magd: {
        Burbuja: 100,
        Glacial: 175,
      },
      Flamewalker: {
        Llamarada: 375,
        Inferno: 500,
      },
      Stoneheart: {
        Pedrisco: 250,
        Monolito: 325,
      },
      Whisperwind: {
        Zumbido: 200,
        Tornado: 275,
      },
    },
    Flamewalker: {
      Magd: {
        Burbuja: 400,
        Glacial: 550,
      },
      Flamewalker: {
        Llamarada: 100,
        Inferno: 175,
      },
      Stoneheart: {
        Pedrisco: 125,
        Monolito: 200,
      },
      Whisperwind: {
        Zumbido: 175,
        Tornado: 225,
      },
    },
    Stoneheart: {
      Magd: {
        Burbuja: 140,
        Glacial: 200,
      },
      Flamewalker: {
        Llamarada: 175,
        Inferno: 200,
      },
      Stoneheart: {
        Pedrisco: 100,
        Monolito: 175,
      },
      Whisperwind: {
        Zumbido: 300,
        Tornado: 475,
      },
    },
    Whisperwind: {
      Magd: {
        Burbuja: 150,
        Glacial: 225,
      },
      Flamewalker: {
        Llamarada: 175,
        Inferno: 240,
      },
      Stoneheart: {
        Pedrisco: 350,
        Monolito: 425,
      },
      Whisperwind: {
        Zumbido: 100,
        Tornado: 175,
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

export { attacksList, damageWizard, health, random };
