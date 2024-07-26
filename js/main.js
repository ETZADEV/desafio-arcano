import { attacksList, damageWizard, health, random, colors } from "./utils.js";

const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");
  const btnReset = document.getElementById("btn-reset");

  setBackgroundColorContainer();
  changeClassCard();

  selectWizard.addEventListener("click", selectWizards);
  selectAttackUser();
  btnReset.addEventListener("click", resetGame);
};

const setBackgroundColorContainer = () => {
  const containers = document.querySelectorAll(
    ".select-wizards__container-image"
  );

  containers.forEach((container) => {
    const wizard = container.getAttribute("value");

    container.style.backgroundImage = `linear-gradient(180deg, ${colors(
      wizard,
      "initial"
    )} 35%, ${colors(wizard, "end")} 100%)`;
  });
};

const selectWizards = () => {
  selectWizardUser();
  selectWizardEnemy();
  disabledBtnSelect();
  hideGameTitle();
  hideSelectWizard();
  showGameCombat();
  showLives();
  showCombat();
  showVictories();
  showRound();
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
  showAttacks(wizardUser.toLowerCase());
  showHealth("user", wizardUser, 1);
};

const selectWizardEnemy = () => {
  const enemyWizard = document.getElementById("enemy-wizard");
  const wizards = ["Magd", "Flamewalker", "Stoneheart", "Whisperwind"];
  const wizardSelected = wizards[random(3, 0)];

  showWizard("enemy", wizardSelected, 2);
  showWizardCombat("enemy", wizardSelected, 2);
  enemyWizard.innerHTML = wizardSelected;
  showHealth("enemy", wizardSelected, 2);
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

const showAttacks = (wizard) => {
  const attack1 = document.getElementById("btn-attack1");
  const attack2 = document.getElementById("btn-attack2");
  const attack1Image = document.createElement("img");
  const attack2Image = document.createElement("img");

  const attacks = attacksList();

  const attackValue1 = attacks[wizard][0];
  const attackValue2 = attacks[wizard][1];

  attack1.style.display = "inline-block";
  attack2.style.display = "inline-block";

  attack1.setAttribute("value", attackValue1);
  attack2.setAttribute("value", attackValue2);

  attack1Image.src = `./img/iconAttacks/${attackValue1.replace(" ", "-")}.png`;
  attack2Image.src = `./img/iconAttacks/${attackValue2.replace(" ", "-")}.png`;

  attack1Image.alt = attackValue1;
  attack2Image.alt = attackValue2;

  attack1Image.classList = "select-attack__image";
  attack2Image.classList = "select-attack__image";

  attack1.innerHTML = attackValue1;
  attack1.appendChild(attack1Image);

  attack2.innerHTML = attackValue2;
  attack2.appendChild(attack2Image);
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
  const attack1 = document.getElementById("btn-attack1");
  const attack2 = document.getElementById("btn-attack2");

  attack1.addEventListener("click", () => {
    const [enemyWizard, enemyAttack] = selectAttackEnemy();
    const userWizard1 = userWizard.textContent;
    const userAttack = attack1.getAttribute("value");

    showAttackPlayers(userWizard1, userAttack, enemyWizard, enemyAttack);
    validateWinner(enemyWizard, userWizard1, userAttack, enemyAttack);
  });

  attack2.addEventListener("click", () => {
    const [enemyWizard, enemyAttack] = selectAttackEnemy();
    const userWizard2 = userWizard.textContent;
    const userAttack = attack2.getAttribute("value");

    showAttackPlayers(userWizard2, userAttack, enemyWizard, enemyAttack);
    validateWinner(enemyWizard, userWizard2, userAttack, enemyAttack);
  });
};

const selectAttackEnemy = () => {
  const enemyWizard = document.getElementById("enemy-wizard").textContent;
  const enemy = enemyWizard.toLowerCase();
  const attacks = attacksList();

  const attack = attacks[enemy][random(1, 0)];

  return [enemyWizard, attack];
};

const showAttackName = (wizard, attack) => {
  const combatAttack = document.getElementById("combat-attack");

  combatAttack.innerHTML = attack;
  combatAttack.style.opacity = 1;
  combatAttack.style.backgroundImage = `linear-gradient(90deg, ${colors(
    wizard,
    "initial"
  )} 0%, ${colors(wizard, "end")} 100%)`;

  setTimeout(() => {
    combatAttack.style.opacity = 0;
  }, 4500);
};

const showAttackCombat = (wizard, id, attack) => {
  const wizardImage = document.getElementById(`combat-${wizard}-${id}`);

  if (attack) {
    const attackPlayer = attack.replace(" ", "-");

    wizardImage.src = `./img/attacks/${attackPlayer}.gif`;

    id == 2
      ? (wizardImage.classList =
          "combat__image--attack combat__image--attack-enemy wizard__player--rotating")
      : (wizardImage.classList =
          "combat__image--attack combat__image--attack-user");

    showAttackName(wizard, attack);
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
  const healthWizard = health(wizard);
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
  const healthBase = health(wizard);
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
        player == "user" ? saveVictories("enemy") : saveVictories("user");

        lives = updateLives("user");
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

  healthUser.innerHTML = health(user);
  healthEnemy.innerHTML = health(enemy);
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
