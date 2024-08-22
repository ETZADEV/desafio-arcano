import { damageWizard, random } from "./utils.js";
import wizards from "./wizards.js";

const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");
  const btnReset = document.getElementById("btn-reset");

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
};

const getWizardsNames = () => {
  const data = Object.values(wizards);
  let wizardsNames = [];

  for (let i = 0; i < data.length; i++) {
    wizardsNames.push(data[i].name);
  }

  return wizardsNames;
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
  const positions = generateRandomPositions();

  calcMapSize();
  drawScene(0, 0, positions);
  handleMovementKeyPress(positions);
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

const drawScene = (x = 0, y = 0, positions) => {
  const userWizard = document.getElementById("user-wizard").textContent;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  let positionX = 0;
  let positionY = 0;
  const [width, height] = calcCanvasSizeFromScreenWidth();

  canvas.width = width;
  canvas.height = height;

  positionX += x;
  positionY += y;

  image.src = wizards[userWizard].urlImage;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, positionX, positionY, 80, 100);
  drawWizardsEnemies(positions);

  validateCollision(x, y, positions);
};

const validateCollision = (x, y, positions) => {
  const wizardsNames = getWizardsNames();
  const canvas = document.getElementById("canvas");

  if (x >= 0 || y >= 0) {
    for (let i = 0; i < positions.length; i++) {
      const collision = checkCollision(x, y, positions[i]);
      const wizard = wizardsNames[i];

      if (collision) {
        canvas.remove();
        hideMap();
        selectWizardEnemy(wizard);
        showGameCombat();
      }
    }
  }
};

const drawWizardsEnemies = (positions) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const data = Object.values(wizards);

  for (let i = 0; i < data.length; i++) {
    const image = new Image();
    const positionX = positions[i].positionX;
    const positionY = positions[i].positionY;

    image.src = data[i].urlImage;

    ctx.drawImage(image, positionX, positionY, 80, 100);
  }
};

const addMouseEventToButton = (positions) => {
  const canvas = document.getElementById("canvas");
  const buttons = document.querySelectorAll(".map__button-navigation");
  let x = 0;
  let y = 0;
  let interval;

  buttons.forEach((button) => {
    button.addEventListener("mousedown", () => {
      interval = setInterval(() => {
        if (button.id === "top" && y > 0) {
          y -= 10;
        } else if (button.id === "left" && x > 0) {
          x -= 10;
        } else if (button.id === "bottom" && y < canvas.height - 100) {
          y += 10;
        } else if (button.id === "right" && x < canvas.width - 80) {
          x += 10;
        }

        drawScene(x, y, positions);
      }, 50);
    });

    button.addEventListener("mouseup", () => {
      clearInterval(interval);
    });
  });
};

const handleMovementKeyPress = (positions) => {
  let x = 0;
  let y = 0;
  let interval;

  window.addEventListener("keydown", (e) => {
    if (!interval) {
      interval = setInterval(() => {
        if (e.key === "ArrowUp" && y > 0) {
          y -= 10;
        } else if (e.key === "ArrowLeft" && x > 0) {
          x -= 10;
        } else if (e.key === "ArrowDown" && y < canvas.height - 100) {
          y += 10;
        } else if (e.key == "ArrowRight" && x < canvas.width - 80) {
          x += 10;
        }

        drawScene(x, y, positions);
      }, 50);
    }
  });

  window.addEventListener("keyup", () => {
    clearInterval(interval);
    interval = null;
  });
};

const generateRandomPositions = () => {
  const [width, height] = calcCanvasSizeFromScreenWidth();
  const data = Object.entries(wizards);
  const positions = [];

  for (let i = 0; i < data.length; i++) {
    const positionX = random(width - 80, 120);
    const positionY = random(height - 100, 140);

    positions.push({ positionX, positionY });
  }

  return positions;
};

const checkCollision = (x, y, enemy) => {
  const topSideUser = 0 + y;
  const leftSideUser = 0 + x;
  const rightSideUser = leftSideUser + 60;
  const bottomSideUser = topSideUser + 80;

  const topSideEnemy = enemy.positionY;
  const leftSideEnemy = enemy.positionX;
  const rightSideEnemy = leftSideEnemy + 80;
  const bottomSideEnemy = topSideEnemy + 100;

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

  showLives();
  showCombat();
  showVictories();
  showRound();
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
  const btnAttacks = document.querySelectorAll(".select-attack__button");

  btnAttacks.forEach((attack) => {
    attack.addEventListener("click", () => {
      const [enemyWizard, enemyAttack] = selectAttackEnemy();
      const userWizardText = userWizard.textContent;
      const userAttack = attack.getAttribute("value").replace("-", " ");

      showAttackPlayers(userWizardText, userAttack, enemyWizard, enemyAttack);
      validateWinner(enemyWizard, userWizardText, userAttack, enemyAttack);
    });
  });
};

const selectAttackEnemy = () => {
  const enemyWizard = document.getElementById("enemy-wizard").textContent;
  const enemy = enemyWizard;
  const attacks = wizards[enemy].attacks;
  const max = attacks.length - 1;
  const attack = attacks[random(max, 0)].attack;

  return [enemyWizard, attack];
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
    const attackPlayer = attack.replace(" ", "-");

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

const showAttackPlayers = (
  userWizard,
  userAttack,
  enemyWizard,
  enemyAttack
) => {
  const healthEnemy = getHealthPlayer(2, enemyWizard, userWizard, userAttack);

  if (healthEnemy > 0) {
    setTimeout(() => showAttackCombat(userWizard, 1, userAttack), 500);
    setTimeout(() => resetShowAttackImg(userWizard, 1), 5000);
    setTimeout(() => showAttackCombat(enemyWizard, 2, enemyAttack), 6500);
    setTimeout(() => resetShowAttackImg(enemyWizard, 2), 10000);
  }

  setTimeout(() => showAttackCombat(userWizard, 1, userAttack), 500);
  setTimeout(() => resetShowAttackImg(userWizard, 1), 5000);
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

const validateWinner = (damaged, attacker, attackUser, attackEnemy) => {
  disabledButtons();

  const [healthWizardEnemy, healthWizardEnemyValue] = updateHealth(
    2,
    damaged,
    attacker,
    attackUser
  );

  if (healthWizardEnemyValue > 0) {
    const [healthWizardUser, healthWizardUserValue] = updateHealth(
      1,
      attacker,
      damaged,
      attackEnemy
    );

    setTimeout(() => {
      healthWizardEnemy.textContent = healthWizardEnemyValue;
      updateHealthBar("enemy", damaged, healthWizardEnemyValue);
    }, 5000);

    if (healthWizardUserValue > 0) {
      setTimeout(() => {
        healthWizardUser.textContent = healthWizardUserValue;
        updateHealthBar("user", attacker, healthWizardUserValue);

        enabledButtons();
      }, 11300);
    } else {
      setTimeout(() => {
        healthWizardEnemy.textContent = healthWizardEnemyValue;
        updateHealthBar("enemy", damaged, healthWizardEnemyValue);
      }, 5000);

      setTimeout(() => {
        healthWizardUser.textContent = 0;
        updateHealthBar("user", attacker, 0);
      }, 11300);

      enemyVictory(damaged, attacker);
    }
  } else {
    setTimeout(() => (healthWizardEnemy.textContent = 0), 1000);
    userVictory(damaged, attacker);
  }
};

const userVictory = (damaged, attacker) => {
  setTimeout(() => {
    updateHealthBar("enemy", damaged, 0);
    showHearts("enemy");
    showImageDead(damaged, 2);
  }, 2000);

  setTimeout(() => {
    showAlert("enemy", attacker, "Gana", "Round", attacker, damaged);
    playAudio("results", "win");
  }, 5000);
};

const enemyVictory = (damaged, attacker) => {
  setTimeout(() => {
    updateHealthBar("user", attacker, 0);
    showHearts("user");
    showImageDead(attacker, 1);
  }, 11300);

  setTimeout(() => {
    showAlert("user", damaged, "Pierde", "Round", attacker, damaged);
    playAudio("results", "lose");
  }, 13000);
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

const showAlert = (player, wizard, result, type, attacker, damaged) => {
  let lives = livesPlayer(player);
  const jsConfetti = new JSConfetti();

  jsConfetti.addConfetti();

  Swal.fire({
    title: `Vencedor ${wizard}`,
    text: `El usuario ${result} el ${type}`,
    color: "#fff",
    imageUrl: `./img/wizards/${wizard}.gif`,
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: `Wizard ${wizard}`,
    allowOutsideClick: false,
  }).then(() => {
    setTimeout(() => {
      if (lives == 0) {
        if (player == "user") {
          saveVictories("enemy");
          lives = updateLives("user");
        } else {
          saveVictories("user");
        }

        showAlert("user", wizard, result, "Combate");
        showBtnReset();
        disabledButtons();
      } else {
        resetRound(attacker, damaged);
      }

      return;
    }, 500);
  });
};

const resetRound = (user, enemy) => {
  updateRound();
  resetHealthRound(user, enemy);
  resetHealthBarRound(user, enemy);
  enabledButtons();
  setTimeout(() => showRound(), 200);
};

const resetHealthRound = (user, enemy) => {
  const healthUser = document.getElementById(`${user}-1`);
  const healthEnemy = document.getElementById(`${enemy}-2`);

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
  location.reload();
};

const saveVictories = (player) => {
  let victories = sessionStorage.getItem(`${player}-victories`);

  !victories
    ? sessionStorage.setItem(`${player}-victories`, 1)
    : sessionStorage.setItem(`${player}-victories`, ++victories);
};

const getVictories = (player) => {
  let victories = sessionStorage.getItem(`${player}-victories`);

  return victories ? victories : 0;
};

const showVictories = () => {
  const results = document.getElementById("results");
  const spanVictoriesUser = document.getElementById("victories-user");
  const spanVictoriesEnemy = document.getElementById("victories-enemy");
  const victoriesUser = getVictories("user");
  const victoriesEnemy = getVictories("enemy");

  if (victoriesUser !== 0 || victoriesEnemy !== 0) {
    results.style.display = "block";
    spanVictoriesUser.innerHTML = victoriesUser;
    spanVictoriesEnemy.innerHTML = victoriesEnemy;
  }
};

window.addEventListener("load", initGame);
