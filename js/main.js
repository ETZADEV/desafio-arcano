import { attacksList, damageWizard, health } from "./wizards.js";

const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");
  const btnReset = document.getElementById("btn-reset");

  selectWizard.addEventListener("click", selectWizards);
  selectAttackUser();
  btnReset.addEventListener("click", resetGame);
};

const selectWizards = () => {
  selectWizardUser();
  selectWizardEnemy();
  disabledBtnSelect();
  showLives();
};

const selectWizardUser = () => {
  const wizardUser = document.querySelector(
    "input[name='wizards']:checked"
  ).value;
  const userWizard = document.getElementById("user-wizard");

  showWizard("user", wizardUser);
  userWizard.innerHTML = wizardUser;
  showAttacks(wizardUser.toLowerCase());
  showHealth("user", wizardUser, 1);
};

const selectWizardEnemy = () => {
  const enemyWizard = document.getElementById("enemy-wizard");
  const wizards = ["Magd", "Flamewalker", "Stoneheart", "Whisperwind"];
  const wizardSelected = wizards[random(3, 0)];

  showWizard("enemy", wizardSelected);
  enemyWizard.innerHTML = wizardSelected;
  showHealth("enemy", wizardSelected, 2);
};

const disabledBtnSelect = () => {
  const selectWizard = document.getElementById("select-wizard");
  selectWizard.disabled = true;
};

const showWizard = (selected, wizard) => {
  const selectedWizard = document.getElementById(`lives-${selected}`);
  const wizardImg = document.createElement("img");

  wizardImg.src = `./img/wizardsBase/${wizard}Base.gif`;
  wizardImg.id = `${wizard}Base`;
  wizardImg.alt = wizard;

  selectedWizard.prepend(wizardImg);
};

const showAttacks = (wizard) => {
  const attack1 = document.getElementById("btn-attack1");
  const attack2 = document.getElementById("btn-attack2");

  let attacks = attacksList();

  let attackValue1 = attacks[wizard][0];
  let attackValue2 = attacks[wizard][1];

  attack1.style.display = "inline-block";
  attack2.style.display = "inline-block";

  attack1.innerHTML = attackValue1;
  attack2.innerHTML = attackValue2;

  attack1.setAttribute("value", attackValue1);
  attack2.setAttribute("value", attackValue2);
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
    createMessages(userWizard1, userAttack, enemyWizard, enemyAttack);
    validateWinner(enemyWizard, userWizard1, userAttack, enemyAttack);
  });

  attack2.addEventListener("click", () => {
    const [enemyWizard, enemyAttack] = selectAttackEnemy();
    const userWizard2 = userWizard.textContent;
    const userAttack = attack2.getAttribute("value");

    showAttackPlayers(userWizard2, userAttack, enemyWizard, enemyAttack);
    createMessages(userWizard2, userAttack, enemyWizard, enemyAttack);
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

const showAttack = (wizard, attack, adjective) => {
  Swal.fire({
    customClass: {
      title: "swal2-title",
    },
    text: `El mago ${adjective}: ${wizard} ataca con ${attack}`,
    color: "#fff",
    imageUrl: `./img/attack/${attack}.gif`,
    imageWidth: 170,
    imageHeight: 80,
    imageAlt: `Attack ${wizard}`,
    showConfirmButton: false,
    allowOutsideClick: false,
    timer: 4000,
  });
};

const showAttackPlayers = (
  userWizard,
  userAttack,
  enemyWizard,
  enemyAttack
) => {
  const healthEnemy = getHealthPlayer(2, enemyWizard, userWizard, userAttack);

  if (healthEnemy > 0) {
    setTimeout(() => showAttack(userWizard, userAttack, "Aliado"), 500);
    setTimeout(() => showAttack(enemyWizard, enemyAttack, "Enemigo"), 6500);
  }

  setTimeout(() => showAttack(userWizard, userAttack, "Aliado"), 500);
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

const createMessages = (userWizard, userAttack, enemyWizard, enemyAttack) => {
  const messages = document.getElementById("messages");
  const message = document.createElement("p");
  message.textContent = `El mago ${userWizard} ataco con ${userAttack} y el mago ${enemyWizard} ataco con ${enemyAttack}`;

  messages.appendChild(message);
};

const showHealth = (player, wizard, id) => {
  const healthWizard = health(wizard);
  const healthContainer = document.getElementById(`health-${player}-container`);
  const wizardHealth = document.createElement("p");

  wizardHealth.id = `${wizard}-${id}`;
  wizardHealth.textContent = healthWizard;

  healthContainer.appendChild(wizardHealth);
};

const updateHealthBar = (player, wizard, healthWizard) => {
  const healthPlayer = document.getElementById(`health-${player}-bar`);
  const healthBase = health(wizard);
  const percent = Math.floor((healthWizard * 100) / healthBase);

  percent <= 0
    ? (healthPlayer.style.width = `0%`)
    : (healthPlayer.style.width = `${percent}%`);
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
    showImageDead(damaged);
  }, 1000);

  setTimeout(() => {
    showAlert("enemy", attacker, "Gana", "Round", attacker, damaged);
  }, 5000);
};

const enemyVictory = (damaged, attacker) => {
  setTimeout(() => {
    updateHealthBar("user", attacker, 0);
    showHearts("user");
    showImageDead(attacker);
  }, 11300);

  setTimeout(() => {
    showAlert("user", damaged, "Pierde", "Round", attacker, damaged);
  }, 13000);
};

const showImageDead = (wizard) => {
  const wizardImg = document.getElementById(`${wizard}Base`);

  wizardImg.src = `./img/dead/${wizard}Dead.gif`;
  wizardImg.alt = `${wizard} dead`;

  setTimeout(() => {
    wizardImg.src = `./img/wizardsBase/${wizard}Base.gif`;
    wizardImg.alt = wizard;
  }, 3200);
};

const disabledButtons = () => {
  const buttons = document.querySelectorAll("#select-attack > p > button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
};

const enabledButtons = () => {
  const buttons = document.querySelectorAll("#select-attack > p > button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
};

const showLives = () => {
  const lives = document.getElementById("lives");

  lives.style.display = "inline";
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
  resetHealthRound(user, enemy);
  resetHealthBarRound(user, enemy);
  enabledButtons();
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
};

const showBtnReset = () => {
  const btnReset = document.getElementById("btn-reset");

  btnReset.style.display = "inline-block";
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

const random = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

window.addEventListener("load", initGame);
