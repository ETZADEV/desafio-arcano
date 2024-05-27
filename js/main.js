const initGame = () => {
  const selectWizard = document.getElementById("select-wizard");

  selectWizard.addEventListener("click", selectWizards);
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

  allyWizard.innerHTML = wizardUser;
};

const selectWizardEnemy = () => {
  const enemyWizard = document.getElementById("enemy-wizard");
  const wizards = ["Magd", "Flamewalker", "Stoneheart", "Whisperwind"];

  enemyWizard.innerHTML = wizards[random(3, 0)];
};

const random = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

window.addEventListener("load", initGame);
