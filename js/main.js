import { attacksList, damageWizard, health } from "./wizards.js";

const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");

  selectWizard.addEventListener("click", selectWizards);
  selectAttackUser();
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

  wizardImg.src = `../img/wizardsBase/${wizard}Base.gif`;
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

    createMessages(userWizard1, userAttack, enemyWizard, enemyAttack);
    validateWinner(enemyWizard, userWizard1, userAttack, enemyAttack);
  });

  attack2.addEventListener("click", () => {
    const [enemyWizard, enemyAttack] = selectAttackEnemy();
    const userWizard2 = userWizard.textContent;
    const userAttack = attack2.getAttribute("value");

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

  const [healthWizardUser, healthWizardUserValue] = updateHealth(
    1,
    attacker,
    damaged,
    attackEnemy
  );

  if (healthWizardUserValue > 0 && healthWizardEnemyValue > 0) {
    healthWizardEnemy.textContent = healthWizardEnemyValue;
    updateHealthBar("enemy", damaged, healthWizardEnemyValue);

    setTimeout(() => {
      healthWizardUser.textContent = healthWizardUserValue;
      updateHealthBar("user", attacker, healthWizardUserValue);

      enabledButtons();
    }, 1000);
  } else {
    if (healthWizardEnemyValue <= 0) {
      healthWizardEnemy.textContent = 0;

      userVictory(damaged, attacker);
    } else if (healthWizardUserValue <= 0) {
      healthWizardUser.textContent = 0;
      healthWizardEnemy.textContent = healthWizardEnemyValue;

      enemyVictory(damaged, attacker);
    }

    setTimeout(() => resetRound(attacker, damaged), 2200);
  }
};

const userVictory = (damaged, attacker) => {
  updateHealthBar("enemy", damaged, 0);
  showHearts("enemy");
  setTimeout(() => showAlert("enemy", attacker, "Gana", "Round"), 800);
};

const enemyVictory = (damaged, attacker) => {
  updateHealthBar("user", attacker, 0);
  showHearts("user");
  setTimeout(() => showAlert("user", damaged, "Pierde", "Round"), 800);
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

    img.src = "../img/lives/death.png";
  }
};

const livesPlayer = (player) => {
  const livesPlayer = document.getElementById(`${player}-wizard`);
  const lives = livesPlayer.getAttribute("lives");

  return lives;
};

const showAlert = (player, wizard, result, type) => {
  const lives = livesPlayer(player);

  Swal.fire({
    title: `Vencedor ${wizard}`,
    text: `El usuario ${result} el ${type}`,
    imageUrl: `../img/wizards/${wizard}.gif`,
    imageWidth: 80,
    imageHeight: 80,
    imageAlt: `Wizard ${wizard}`,
  }).then(() => {
    setTimeout(() => {
      if (lives <= 0) showAlert("user", wizard, result, "Combate");
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

const random = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

window.addEventListener("load", initGame);
