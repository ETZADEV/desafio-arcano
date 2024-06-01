const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");

  selectWizard.addEventListener("click", selectWizards);
  attack();
};

const selectWizards = () => {
  selectWizardUser();
  selectWizardEnemy();
};

const selectWizardUser = () => {
  const wizardUser = document.querySelector(
    "input[name='wizards']:checked"
  ).value;
  const allyWizard = document.getElementById("ally-wizard");

  selectAttack(wizardUser.toLowerCase());
  allyWizard.innerHTML = wizardUser;
};

const selectWizardEnemy = () => {
  const enemyWizard = document.getElementById("enemy-wizard");
  const wizards = ["Magd", "Flamewalker", "Stoneheart", "Whisperwind"];
  const wizardSelected = wizards[random(3, 0)];

  enemyWizard.innerHTML = wizardSelected;
};

const selectAttack = (wizard) => {
  const attack1 = document.getElementById("btn-attack1");
  const attack2 = document.getElementById("btn-attack2");
  const magd = ["Hidrobol", "Crioesfera"];
  const flamewalker = ["Llamarada", "Ignición"];
  const stoneheart = ["Rocío sísmico", "Túmulo"];
  const whisperwind = ["Zumbido", "Tornado"];
  const attacks = { magd, flamewalker, stoneheart, whisperwind };

  let attackValue1 = attacks[wizard][0];
  let attackValue2 = attacks[wizard][1];

  attack1.innerHTML = attackValue1;
  attack2.innerHTML = attackValue2;

  attack1.setAttribute("value", attackValue1);
  attack2.setAttribute("value", attackValue2);
};

const attack = () => {
  const attack1 = document.getElementById("btn-attack1");
  const attack2 = document.getElementById("btn-attack2");

  attack1.addEventListener("click", () =>
    console.log(`Ataca con ${attack1.getAttribute("value")}`)
  );

  attack2.addEventListener("click", () =>
    console.log(`Ataca con ${attack2.getAttribute("value")}`)
  );
};

const random = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

window.addEventListener("load", initGame);
