import { attacksList, damageWizard, lives } from "./wizards.js";

const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");

  selectWizard.addEventListener("click", selectWizards);
  selectAttackUser();
};

const selectWizards = () => {
  selectWizardUser();
  selectWizardEnemy();
};

const selectWizardUser = () => {
  const wizardUser = document.querySelector(
    "input[name='wizards']:checked"
  ).value;
  const userWizard = document.getElementById("user-wizard");

  userWizard.innerHTML = wizardUser;
  showAttacks(wizardUser.toLowerCase());
  showLife(wizardUser, 1);
};

const selectWizardEnemy = () => {
  const enemyWizard = document.getElementById("enemy-wizard");
  const wizards = ["Magd", "Flamewalker", "Stoneheart", "Whisperwind"];
  const wizardSelected = wizards[random(3, 0)];

  enemyWizard.innerHTML = wizardSelected;
  showLife(wizardSelected, 2);
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

const showLife = (wizard, id) => {
  const lifeWizard = lives(wizard);
  const livesContainer = document.getElementById("lives");
  const wizardLife = document.createElement("p");

  wizardLife.id = `${wizard}-${id}`;
  wizardLife.textContent = lifeWizard;

  livesContainer.appendChild(wizardLife);
};

const updateLife = (id, damaged, attacker, attack) => {
  const lifeWizard = document.getElementById(`${damaged}-${id}`);
  let lifeWizardValue = lifeWizard.textContent;

  const damage = damageWizard(damaged, attacker, attack);
  lifeWizardValue -= damage;

  console.log(`Damaged: ${damaged}, attacker: ${attacker}, attack: ${attack}`);

  return [lifeWizard, lifeWizardValue];
};

const validateWinner = (damaged, attacker, attackUser, attackEnemy) => {
  const [lifeWizardEnemy, lifeWizardEnemyValue] = updateLife(
    2,
    damaged,
    attacker,
    attackUser
  );

  const [lifeWizardUser, lifeWizardUserValue] = updateLife(
    1,
    attacker,
    damaged,
    attackEnemy
  );

  console.log(lifeWizardUserValue);
  console.log(lifeWizardEnemyValue);

  if (lifeWizardUserValue > 0 && lifeWizardEnemyValue > 0) {
    lifeWizardUser.textContent = lifeWizardUserValue;
    lifeWizardEnemy.textContent = lifeWizardEnemyValue;
  } else {
    if (lifeWizardUserValue < 0) {
      lifeWizardUser.textContent = 0;
      alert(`El mago ${damaged} gana el Jugador Pierde`);
    } else if (lifeWizardEnemyValue < 0) {
      lifeWizardEnemy.textContent = 0;
      alert(`El mago ${attacker} gana la PC pierde`);
    }
  }
};

const random = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

window.addEventListener("load", initGame);
