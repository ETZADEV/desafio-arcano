const wizards = {
  Magd: {
    name: "Magd",
    urlImage: "./img/wizards/Magd.gif",
    elementImage: "./img/elements/water.png",
    attacks: [
      { attack: "Water Jet", image: "./img/iconAttacks/Water-Jet.png" },
      { attack: "Freezing", image: "./img/iconAttacks/Freezing.png" },
    ],
    element: "Water",
    health: 1020,
    colors: ["#003564", "#016ca0"],
  },
  Flamewalker: {
    name: "Flamewalker",
    urlImage: "./img/wizards/Flamewalker.gif",
    elementImage: "./img/elements/fire.png",
    attacks: [
      { attack: "Fireball", image: "./img/iconAttacks/Fireball.png" },
      { attack: "Fire Blaze", image: "./img/iconAttacks/Fire-Blaze.png" },
    ],
    element: "Fire",
    health: 1033,
    colors: ["#b40e22", "#dc466b"],
  },
  Stoneheart: {
    name: "Stoneheart",
    urlImage: "./img/wizards/Stoneheart.gif",
    elementImage: "./img/elements/earth.png",
    attacks: ["Earth Bullets", "Boulder Toss"],
    attacks: [
      { attack: "Earth Bullets", image: "./img/iconAttacks/Earth-Bullets.png" },
      { attack: "Boulder Toss", image: "./img/iconAttacks/Boulder-Toss.png" },
    ],
    element: "Earth",
    health: 1010,
    colors: ["#673514", "#a7551b"],
  },
  Whisperwind: {
    name: "Whisperwind",
    urlImage: "./img/wizards/Whisperwind.gif",
    elementImage: "./img/elements/wind.png",
    attacks: [
      { attack: "Slam", image: "./img/iconAttacks/Slam.png" },
      { attack: "Tornado", image: "./img/iconAttacks/Tornado.png" },
    ],
    element: "Wind",
    health: 1000,
    colors: ["#00967d", "#00d9b4"],
  },
};

export default wizards;
