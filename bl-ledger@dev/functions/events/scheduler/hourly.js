const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const types = {
  game: `GAME`,
  listening: `LISTENING`,
  watching: `WATCHING`,
  competing: `COMPETING`,
};
const statuses = {
  dnd: `DND`,
  idle: `IDLE`,
};

function status(aName, aType, status) {
  this.aName = aName;
  this.aType = aType;
  this.status = status;
}

let comboList = [
  new status('New World', types.game, statuses.dnd),
  new status('New World', types.game, statuses.idle),
  new status('Masterchef', types.watching, statuses.dnd),
  new status('Tommy Seebach Apache', types.listening, statuses.dnd),
  new status(
    "Cooper's Hill Cheese-Rolling and Wake",
    types.competing,
    statuses.dnd
  ),
  new status('ASMR', types.listening, statuses.idle),
  new status('Yu-Gi-Oh', types.competing, statuses.dnd),
];

let selectedCombo = comboList[Math.floor(Math.random() * comboList.length)];

let result = await lib.discord.users['@0.1.1'].me.status.update({
  activity_name: selectedCombo.aName,
  activity_type: selectedCombo.aType,
  status: selectedCombo.status,
});
