import { damageWizard, random } from "./utils.js";
import wizards from "./wizards.js";

let idPlayer = null;
let enemiesList = null;
let globalInterval = null;
let statePlayer = null;
let attack = null;
let socket = null;
let combat = true;
const url = "https://desafio-arcano.onrender.com";

const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");
  const btnReset = document.getElementById("btn-reset");

  joinGame();
  createCardWizard(wizards);

  selectWizard.addEventListener("click", selectWizards);
  btnReset.addEventListener("click", resetGame);
};

const getCharacteristicWizard = (wizard, characteristic) =>
  wizards[wizard][characteristic];

const setBackgroundColorContainer = () => {
  const containers = document.querySelectorAll(
    ".select-wizards__container-image"
  );

  containers.forEach((container) => {
    const wizard = container.getAttribute("value");
    const [start, end] = getCharacteristicWizard(wizard, "colors");

    container.style.backgroundImage = `linear-gradient(180deg, ${start} 35%, ${end} 100%)`;
  });
};

const selectWizards = () => {
  selectWizardUser();
  disabledBtnSelect();
  hideGameTitle();
  hideSelectWizard();
  selectAttackUser();
  showMap();
  connectWebsocket();
};

const createCardWizard = (wizards) => {
  const cardsContainer = document.getElementById("select-wizards-cards");
  const data = Object.values(wizards);

  for (let i = 0; i < data.length; i++) {
    const name = data[i].name;
    const urlImage = data[i].urlImage;
    const urlElementImage = data[i].elementImage;
    const element = data[i].element;

    let card;

    i === 0
      ? (card = `<div class="select-wizards__card select-wizards__card--selected" wizard=${name}>
            <input
              type="radio"
              name="wizards"
              id=${name.toLowerCase()}
              class="select-wizards__input"
              value=${name}
              checked
            />
            <label class="select-wizards__label" for=${name.toLowerCase()}>
              <img
                src=${urlImage}
                alt="Wizard ${name}"
                class="select-wizards__image-wizard"
              />
              <p>${name}</p>
            </label>
            <div class="select-wizards__container-image" value=${name}>
              <img
                src=${urlElementImage}
                alt=${element}
                class="select-wizards__image-type"
              />
            </div>
          </div>`)
      : (card = `<div class="select-wizards__card" wizard=${name}>
            <input
              type="radio"
              name="wizards"
              id=${name.toLowerCase()}
              class="select-wizards__input"
              value=${name}
            />
            <label class="select-wizards__label" for=${name.toLowerCase()}>
              <img
                src=${urlImage}
                alt="Wizard ${name}"
                class="select-wizards__image-wizard"
              />
              <p>${name}</p>
            </label>
            <div class="select-wizards__container-image" value=${name}>
              <img
                src=${urlElementImage}
                alt=${element}
                class="select-wizards__image-type"
              />
            </div>
          </div>`);

    cardsContainer.innerHTML += card;

    setBackgroundColorContainer();
    changeClassCard();
  }
};

const getCardsWizards = () =>
  document.querySelectorAll(".select-wizards__card");

const getWizardInput = () => document.getElementsByName("wizards");

const changeClassCard = () => {
  const cards = getCardsWizards();
  const inputs = getWizardInput();

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      for (let i of inputs) {
        if (i.checked) {
          cards.forEach((card) => {
            card.classList.remove("select-wizards__card--selected");
            const wizard = card.getAttribute("wizard");

            if (i.value == wizard) {
              card.classList.add("select-wizards__card--selected");
            }
          });
        }
      }
    });
  });
};

const selectWizardUser = () => {
  const wizardUser = document.querySelector(
    "input[name='wizards']:checked"
  ).value;
  const userWizard = document.getElementById("user-wizard");

  showWizard("user", wizardUser, 1);
  showWizardCombat("user", wizardUser, 1);
  userWizard.innerHTML = wizardUser;
  createButtonsAttacks(wizards, wizardUser);
  showHealth("user", wizardUser, 1, wizards);

  registerWizardSelected(wizardUser);
};

const selectWizardEnemy = (wizard) => {
  const enemyWizard = document.getElementById("enemy-wizard");
  const wizardSelected = wizard;

  showWizard("enemy", wizardSelected, 2);
  showWizardCombat("enemy", wizardSelected, 2);
  enemyWizard.innerHTML = wizardSelected;
  showHealth("enemy", wizardSelected, 2, wizards);
};

const calcMapSize = () => {
  const heightWindow = window.innerHeight;
  const map = document.getElementById("map");
  const heightMap = map.clientHeight;

  if (heightMap < heightWindow) {
    map.style.height = "calc(100vh - 40px)";
  }
};

const showMap = () => {
  const map = document.getElementById("map");
  map.style.display = "flex";
  const coordinates = generateRandomPosition();

  calcMapSize();
  drawScene(coordinates);
  handleMovementKeyPress(coordinates);
};

const hideMap = () => {
  const map = document.getElementById("map");
  map.style.display = "none";
};

const calcCanvasSizeFromScreenWidth = () => {
  const widthWidow = window.innerWidth;
  let width = 700;
  let height = 500;

  if (widthWidow < 740) {
    width = widthWidow - 40;
  }

  return [width, height];
};

const drawScene = (coordinates) => {
  const userWizard = document.getElementById("user-wizard").textContent;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  let positionX = coordinates.positionX;
  let positionY = coordinates.positionY;
  const [width, height] = calcCanvasSizeFromScreenWidth();

  canvas.width = width;
  canvas.height = height;

  image.src = wizards[userWizard].urlImage;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, positionX, positionY, 80, 100);

  drawWizardsEnemies();
  validateCollision(coordinates);
};

const validateCollision = (coordinates) => {
  const canvas = document.getElementById("canvas");

  if (enemiesList !== null) {
    for (const enemy of enemiesList) {
      if (enemy.hasOwnProperty("wizard") && enemy.hasOwnProperty("positionX")) {
        const wizard = enemy.wizard;
        const positionX = enemy.positionX;
        const positionY = enemy.positionY;
        const enemyPosition = { positionX, positionY };

        const collision = checkCollision(coordinates, enemyPosition);

        if (collision) {
          hideMap();
          sendEnemyId(enemy.id);
          clearInterval(globalInterval);
          selectWizardEnemy(wizard);
          showGameCombat();
          setTimeout(() => {
            sendWizardCoordinates(
              coordinates.positionX - 1000,
              coordinates.positionY - 1000
            );
          }, 500);
          canvas.remove();
        }
      }
    }
  }
};

const drawWizardsEnemies = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const data = Object.values(wizards);

  if (enemiesList !== null) {
    enemiesList.forEach((enemy) => {
      if (enemy.hasOwnProperty("wizard")) {
        const image = new Image();
        const positionX = enemy.positionX;
        const positionY = enemy.positionY;
        const wizard = data.filter((wizard) => wizard.name === enemy.wizard);

        image.src = wizard[0].urlImage;
        ctx.drawImage(image, positionX, positionY, 80, 100);
      }
    });
  }
};

const handleMovementKeyPress = (coordinates) => {
  let x = coordinates.positionX;
  let y = coordinates.positionY;
  let positions = null;
  let interval;

  window.addEventListener("keydown", (e) => {
    if (!interval) {
      interval = setInterval(() => {
        if (e.key === "ArrowUp" && y > 0) {
          y -= 15;
        } else if (e.key === "ArrowLeft" && x > 0) {
          x -= 15;
        } else if (e.key === "ArrowDown" && y < canvas.height - 100) {
          y += 15;
        } else if (e.key == "ArrowRight" && x < canvas.width - 80) {
          x += 15;
        }

        positions = { positionX: x, positionY: y };
      }, 30);
    }
  });

  globalInterval = setInterval(() => {
    if (positions === null) {
      drawScene(coordinates);
      sendWizardCoordinates(coordinates.positionX, coordinates.positionY);
    } else {
      drawScene(positions);
      sendWizardCoordinates(positions.positionX, positions.positionY);
    }
  }, 30);

  window.addEventListener("keyup", () => {
    clearInterval(interval);
    interval = null;
  });
};

const generateRandomPosition = () => {
  const [width, height] = calcCanvasSizeFromScreenWidth();

  const positionX = random(width - 80, 120);
  const positionY = random(height - 100, 140);

  return { positionX, positionY };
};

const checkCollision = (coordinates, enemy) => {
  const topSideUser = coordinates.positionY;
  const leftSideUser = coordinates.positionX;
  const rightSideUser = leftSideUser + 60;
  const bottomSideUser = topSideUser + 80;

  const topSideEnemy = enemy.positionY;
  const leftSideEnemy = enemy.positionX;
  const rightSideEnemy = leftSideEnemy + 60;
  const bottomSideEnemy = topSideEnemy + 80;

  if (
    topSideUser > bottomSideEnemy ||
    leftSideUser > rightSideEnemy ||
    bottomSideUser < topSideEnemy ||
    rightSideUser < leftSideEnemy
  ) {
    return;
  }

  return true;
};

const disabledBtnSelect = () => {
  const selectWizard = document.getElementById("select-wizard");
  selectWizard.disabled = true;
};

const hideGameTitle = () => {
  const title = document.querySelector(".game__title");

  title.style.display = "none";
};

const hideSelectWizard = () => {
  const selectWizard = document.getElementById("select-wizards");

  selectWizard.style.display = "none";
};

const showGameCombat = () => {
  const gameCombat = document.getElementById("game-combat");
  gameCombat.style.display = "block";

  setTimeout(() => getState(), 1000);
  showLives();
  showCombat();
  showRound();
  receiveAttacks();
};

const combatInteractionHandler = () => {
  const enemyWizard = document.getElementById("enemy-wizard").textContent;
  const userWizard = document.getElementById("user-wizard").textContent;

  if (attack !== null) {
    showAttackCombat(enemyWizard, 2, attack);
    setTimeout(() => resetShowAttackImg(enemyWizard, 2), 5000);
    validateWinner(1, "user", userWizard, enemyWizard, attack);

    if (combat) {
      setTimeout(() => enabledButtons(), 6000);
    }
  }
};

const handleAttackButtons = () => {
  setTimeout(() => {
    if (statePlayer === "attacking") {
      enabledButtons();
    } else if (statePlayer === "waiting") {
      disabledButtons();
    }
  }, 2500);
};

const showCombat = () => {
  const combat = document.getElementById("combat");
  const selectAttack = document.getElementById("select-attack");

  combat.style.display = "flex";
  selectAttack.style.display = "flex";
};

const showWizard = (player, wizard, id) => {
  const containerWizard = document.getElementById(`lives-${player}`);
  const wizardImg = document.createElement("img");

  wizardImg.src = `./img/wizardsBase/${wizard}Base.gif`;
  wizardImg.id = `${wizard}Base-${id}`;
  wizardImg.alt = wizard;

  player == "enemy"
    ? (wizardImg.className = "wizard__player--rotating lives__image ")
    : (wizardImg.className = "lives__image");

  containerWizard.prepend(wizardImg);
};

const showWizardCombat = (player, wizard, id) => {
  const containerWizard = document.getElementById(`combat-${player}`);
  const combatWizardImage = document.createElement("img");

  combatWizardImage.src = `./img/wizards/${wizard}.gif`;
  combatWizardImage.id = `combat-${wizard}-${id}`;
  combatWizardImage.alt = `wizard ${wizard}`;

  player == "enemy"
    ? (combatWizardImage.className = "combat__image wizard__player--rotating")
    : (combatWizardImage.className = "combat__image ");

  containerWizard.appendChild(combatWizardImage);
};

const createButtonsAttacks = (wizards, wizard) => {
  const selectAttack = document.getElementById("select-attack");
  const attacks = wizards[wizard].attacks;

  attacks.forEach((attack) => {
    const attackNameFormat = attack.attack.replace(" ", "-");

    const button = `<button type="button" id="btn-attack-${attackNameFormat}" value=${attackNameFormat} class="select-attack__button">
          ${attack.attack}
          <img src=${attack.image} alt=${attackNameFormat} class="select-attack__image"/>
        </button>`;

    selectAttack.innerHTML += button;
  });
};

const showRound = () => {
  const round = document.getElementById("round").value;

  playAudio("rounds", round);

  Swal.fire({
    title: "Fight!",
    imageUrl: `./img/rounds/round-${round}.png`,
    imageWidth: 200,
    imageAlt: `Round ${round}`,
    timer: 3000,
    showConfirmButton: false,
    allowOutsideClick: false,
  });

  handleAttackButtons();
  combat = true;
};

const playAudio = (folder, sound) => {
  const audio = new Audio(`./sounds/${folder}/${sound}.mp3`);

  audio.play();
};

const updateRound = () => {
  const round = document.getElementById("round");
  let roundValue = ++round.value;

  round.value = roundValue;
};

const selectAttackUser = () => {
  const userWizard = document.getElementById("user-wizard");
  const enemyWizard = document.getElementById("enemy-wizard");
  const btnAttacks = document.querySelectorAll(".select-attack__button");

  btnAttacks.forEach((attack) => {
    attack.addEventListener("click", () => {
      const userWizardText = userWizard.textContent;
      const enemyWizardText = enemyWizard.textContent;
      const userAttack = attack.getAttribute("value").replace("-", " ");
      const data = { idPlayer, attack: userAttack };

      showAttackPlayer(userWizardText, userAttack, enemyWizardText);
      validateWinner(2, "enemy", enemyWizardText, userWizardText, userAttack);
      sendAttacks(data);
    });
  });
};

const showAttackName = (wizard, attack) => {
  const combatAttack = document.getElementById("combat-attack");
  const [start, end] = getCharacteristicWizard(wizard, "colors");

  combatAttack.innerHTML = attack;
  combatAttack.style.opacity = 1;
  combatAttack.style.backgroundImage = `linear-gradient(90deg, ${start} 0%, ${end} 100%)`;

  setTimeout(() => {
    combatAttack.style.opacity = 0;
  }, 4500);
};

const showAttackCombat = (wizard, id, attack) => {
  const wizardImage = document.getElementById(`combat-${wizard}-${id}`);

  if (attack) {
    const attackPlayer = String(attack).replace(" ", "-");

    wizardImage.src = `./img/attacks/${attackPlayer}.gif`;

    if (id === 1) {
      wizardImage.classList =
        "combat__image--attack combat__image--attack-user";
      showAttackName(wizard, attack.replace("-", " "));
    } else {
      wizardImage.classList =
        "combat__image--attack combat__image--attack-enemy wizard__player--rotating";
      showAttackName(wizard, attack);
    }

    playAudio("attacks", attackPlayer);
  }
};

const resetShowAttackImg = (wizard, id) => {
  const wizardImage = document.getElementById(`combat-${wizard}-${id}`);

  wizardImage.src = `./img/wizards/${wizard}.gif`;

  id == 2
    ? (wizardImage.className = "combat__image wizard__player--rotating")
    : (wizardImage.className = "combat__image ");
};

const showAttackPlayer = (userWizard, userAttack, enemyWizard) => {
  const healthEnemy = getHealthPlayer(2, enemyWizard, userWizard, userAttack);

  showAttackCombat(userWizard, 1, userAttack);
  setTimeout(() => resetShowAttackImg(userWizard, 1), 4500);
};

const getHealthPlayer = (
  id,
  playerWizard,
  contenderWizard,
  contenderAttack
) => {
  let healthPlayer = document.getElementById(
    `${playerWizard}-${id}`
  ).textContent;
  const damagePlayer = damageWizard(
    playerWizard,
    contenderWizard,
    contenderAttack
  );

  healthPlayer -= damagePlayer;

  return healthPlayer;
};

const showHealth = (player, wizard, id) => {
  const healthWizard = getCharacteristicWizard(wizard, "health");
  const healthContainer = document.getElementById(`health-${player}-container`);
  const wizardHealth = document.createElement("p");

  wizardHealth.id = `${wizard}-${id}`;
  wizardHealth.textContent = healthWizard;
  player == "enemy"
    ? (wizardHealth.className =
        "lives__health-value lives__health-value--enemy")
    : (wizardHealth.className =
        "lives__health-value lives__health-value--user");

  healthContainer.appendChild(wizardHealth);
};

const updateHealthBar = (player, wizard, healthWizard) => {
  const healthPlayer = document.getElementById(`health-${player}-bar`);
  const healthBase = getCharacteristicWizard(wizard, "health");
  const percent = Math.floor((healthWizard * 100) / healthBase);

  percent <= 0
    ? (healthPlayer.style.width = `0%`)
    : (healthPlayer.style.width = `${percent}%`);

  changeColorBar(percent, healthPlayer);
};

const changeColorBar = (percent, healthPlayer) => {
  if (percent <= 70 && percent > 50) {
    healthPlayer.style.backgroundColor = "#c7520a";
  }

  if (percent <= 50 && percent > 20) {
    healthPlayer.style.backgroundColor = "#b93303";
  }

  if (percent <= 20) {
    healthPlayer.style.backgroundColor = "#ff0c0c";
  }
};

const updateHealth = (id, damaged, attacker, attack) => {
  const healthWizard = document.getElementById(`${damaged}-${id}`);
  let healthWizardValue = healthWizard.textContent;

  const damage = damageWizard(damaged, attacker, attack);
  healthWizardValue -= damage;

  return [healthWizard, healthWizardValue];
};

const validateWinner = (id, player, damaged, attacker, attackUser) => {
  disabledButtons();

  const [healthWizardEnemy, healthWizardEnemyValue] = updateHealth(
    id,
    damaged,
    attacker,
    attackUser
  );

  if (healthWizardEnemyValue > 0) {
    setTimeout(() => {
      healthWizardEnemy.textContent = healthWizardEnemyValue;
      updateHealthBar(player, damaged, healthWizardEnemyValue);
    }, 5000);
  } else {
    combat = false;
    setTimeout(() => {
      healthWizardEnemy.textContent = 0;
      updateHealthBar(player, damaged, 0);
    }, 5000);

    playerResult(id, player, damaged, attacker);
  }
};

const getRolePlayer = (player) => {
  let playerGame;
  let sound;

  if (player !== "user") {
    playerGame = "Aliado";
    sound = "win";
  } else {
    playerGame = "Enemigo";
    sound = "lose";
  }

  return [playerGame, sound];
};

const playerResult = (id, player, damaged, attacker) => {
  const [playerGame, sound] = getRolePlayer(player);

  setTimeout(() => {
    showHearts(player);
    showImageDead(damaged, id);
  }, 6000);

  setTimeout(() => {
    showAlert(
      id,
      playerGame,
      attacker,
      "Gana",
      "Round",
      damaged,
      attacker,
      player
    );
    playAudio("results", sound);
  }, 7500);
};

const showImageDead = (wizard, id) => {
  const wizardImg = document.getElementById(`${wizard}Base-${id}`);
  const wizardCombatImg = document.getElementById(`combat-${wizard}-${id}`);

  wizardImg.src = `./img/dead/${wizard}Dead.gif`;
  wizardImg.alt = `${wizard} dead`;

  wizardCombatImg.src = `./img/dead/${wizard}Dead.gif`;
  wizardCombatImg.alt = `${wizard} dead`;

  setTimeout(() => {
    wizardImg.src = `./img/wizardsBase/${wizard}Base.gif`;
    wizardImg.alt = wizard;

    wizardCombatImg.src = `./img/wizards/${wizard}.gif`;
    wizardCombatImg.alt = wizard;
  }, 3200);
};

const disabledButtons = () => {
  const buttons = document.querySelectorAll("#select-attack > button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
};

const enabledButtons = () => {
  const buttons = document.querySelectorAll("#select-attack > button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
};

const showLives = () => {
  const lives = document.getElementById("lives");

  lives.style.display = "flex";
};

const updateLives = (player) => {
  const livesPlayer = document.getElementById(`${player}-wizard`);
  let lives = livesPlayer.getAttribute("lives");
  lives -= 1;

  livesPlayer.setAttribute("lives", lives);

  return lives;
};

const showHearts = (player) => {
  const lives = updateLives(player);
  const imgLives = document.querySelectorAll(`#hearts-${player} > img`);

  for (let i = 3; i > lives; i--) {
    const img = imgLives[i - 1];

    img.src = "./img/lives/death.png";
    img.className = "lives__heart-death-image";
  }
};

const livesPlayer = (player) => {
  const livesPlayer = document.getElementById(`${player}-wizard`);
  const lives = livesPlayer.getAttribute("lives");

  return lives;
};

const showAlert = (
  id,
  player,
  wizard,
  result,
  type,
  damaged,
  attacker,
  playerType
) => {
  const jsConfetti = new JSConfetti();
  let lives = livesPlayer(playerType);

  jsConfetti.addConfetti();

  Swal.fire({
    title: `Vencedor ${wizard}`,
    text: `El mago ${player} ${result} el ${type}`,
    color: "#fff",
    imageUrl: `./img/wizards/${wizard}.gif`,
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: `Wizard ${wizard}`,
    allowOutsideClick: false,
    showConfirmButton: false,
    timer: 3000,
  });

  console.log(lives);

  setTimeout(() => {
    if (lives == 0) {
      showAlertCombat(wizard, player, result, "Combate");
      showBtnReset();
      disabledButtons();
    } else {
      resetRound(id, attacker, damaged);
    }
  }, 4000);
};

const showAlertCombat = (wizard, player, result, type) => {
  Swal.fire({
    title: `Vencedor ${wizard}`,
    text: `El mago ${player} ${result} el ${type}`,
    color: "#fff",
    imageUrl: `./img/wizards/${wizard}.gif`,
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: `Wizard ${wizard}`,
    allowOutsideClick: false,
    showConfirmButton: false,
    timer: 3000,
  });
};

const resetRound = (id, user, enemy) => {
  updateRound();
  resetHealthRound(id, user, enemy);
  resetHealthBarRound(user, enemy);
  setTimeout(() => showRound(), 200);
};

const resetHealthRound = (id, user, enemy) => {
  let healthUser;
  let healthEnemy;

  if (id !== 1) {
    healthUser = document.getElementById(`${user}-1`);
    healthEnemy = document.getElementById(`${enemy}-2`);
  } else {
    healthUser = document.getElementById(`${enemy}-1`);
    healthEnemy = document.getElementById(`${user}-2`);
  }

  healthUser.innerHTML = getCharacteristicWizard(user, "health");
  healthEnemy.innerHTML = getCharacteristicWizard(enemy, "health");
};

const resetHealthBarRound = () => {
  const healthUserBar = document.getElementById(`health-user-bar`);
  const healthEnemyBar = document.getElementById(`health-enemy-bar`);

  healthUserBar.style.width = "100%";
  healthEnemyBar.style.width = "100%";
  healthUserBar.style.backgroundColor = "#3f9878";
  healthEnemyBar.style.backgroundColor = "#3f9878";
};

const showBtnReset = () => {
  const reset = document.getElementById("reset");

  reset.style.display = "flex";
};

const resetGame = () => {
  closeConnection();
  location.reload();
};

const joinGame = () => {
  fetch(`${url}/join`).then((res) => {
    if (res.ok) {
      res.text().then((player) => {
        idPlayer = player;
      });
    }
  });
};

const registerWizardSelected = (wizard) => {
  fetch(`${url}/wizard/${idPlayer}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wizard,
    }),
  });
};

const sendWizardCoordinates = (positionX, positionY) => {
  fetch(`${url}/wizard/${idPlayer}/position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      positionX,
      positionY,
    }),
  }).then((res) => {
    if (res.ok) {
      res.json().then(({ enemies }) => {
        enemiesList = enemies;
      });
    }
  });
};

const sendEnemyId = (enemyId) => {
  fetch(`${url}/enemy/${idPlayer}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      enemyId,
    }),
  });
};

const getState = () => {
  fetch(`${url}/player/${idPlayer}/state`).then((res) => {
    if (res.ok) {
      res.text().then((state) => {
        statePlayer = state;
      });
    }
  });
};

const connectWebsocket = () => {
  socket = new WebSocket("wss://desafio-arcano.onrender.com");

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        idPlayer,
      })
    );
  };
};

const closeConnection = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
};

const sendAttacks = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        data,
      })
    );
  }
};

const receiveAttacks = () => {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "attack" && data.attack) {
      attack = data.attack;
      combatInteractionHandler();
    }
  };
};

window.addEventListener("load", initGame);
