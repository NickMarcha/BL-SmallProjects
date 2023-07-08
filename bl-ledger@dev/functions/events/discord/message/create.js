//Was message create
// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let author = context.params.event.author.id;

let DBEntry = (
  await lib.googlesheets.query['@0.3.0'].select({
    spreadsheetId: process.env.DBSPREADSHEET,
    range: `CraftingDB!A:C`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        DiscordID__is: `${author}`,
      },
    ],
    limit: {
      count: 1,
      offset: 0,
    },
  })
).rows[0]?.fields;

if (DBEntry) {
  console.log(`Authorized access: ` + DBEntry.Name);
} else {
  console.log(`Tried access:` + author);
  console.log(context.params.event.content);
  return;
}

const stringSimilarity = require('string-similarity');
const input = context.params.event.content.toLowerCase();
let amount = 1;
let full = false;

if (input.match(/!craft\d*\b \D/)) {
  try {
    let intstr = input.slice(6).split(' ')[0];
    console.log(intstr);
    amount = parseInt(intstr);
    if (Number.isNaN(amount)) {
      amount = 1;
    }
  } catch (e) {
    console.log(e);
    amount = 1;
  }
} else if (input.match(/!craft\b \d+ /)) {
  try {
    let intstr = input.split(' ')[1];
    console.log(intstr);
    amount = parseInt(intstr);
    if (Number.isNaN(amount)) {
      amount = 1;
    }
  } catch (e) {
    console.log(e);
    amount = 1;
  }
} else if (input.match(/!craftfull\d*\b \D/)) {
  try {
    full = true;
    let intstr = input.slice(6).split(' ')[0];
    console.log(intstr);
    amount = parseInt(intstr);
    if (Number.isNaN(amount)) {
      amount = 1;
    }
  } catch (e) {
    console.log(e);
    amount = 1;
  }
} else if (input.match(/!craftfull\b \d+ /)) {
  try {
    full = true;
    let intstr = input.split(' ')[1];
    console.log(intstr);
    amount = parseInt(intstr);
    if (Number.isNaN(amount)) {
      amount = 1;
    }
  } catch (e) {
    console.log(e);
    amount = 1;
  }
} else {
  return;
}
console.log('amount:' + amount);
const RecipesReq = require(`../../../../Util/Recipes.js`);
const fetch = require('node-fetch');
rRequest = await (
  await fetch(DBEntry.DatabaseURL, {
    method: 'Get',
  })
).json();

let Recipes = new RecipesReq(rRequest);

let params = context.params.event.content.split(' ');
let item = params.slice(1).join(' ');
console.log(`Got request: ` + params.slice(1).join(', '));

//({c,(levenshtein(c, item))})
let levList = Recipes.craftables
  .map((c) => {
    return {item: c, ld: stringSimilarity.compareTwoStrings(c, item)};
  })
  .sort((a, b) => b.ld - a.ld);
console.log(levList);

let bestMatches = levList.filter((e) => e.ld === levList[0].ld);
let bestMatch;
let content;
if (bestMatches.length == 1) {
  //success
  bestMatch = bestMatches[0].item;
  if (full) {
    content = Recipes.itemToFullRecipesString(bestMatch, amount);
  } else {
    content = Recipes.itemToRecipesBoxString(bestMatch, amount);
  }
} else if (bestMatches.length < 1) {
  content = 'something went very wrong';
} else {
  content =
    'Could not determine what you were looking for: ' +
    bestMatches.map((e) => e.item).join(', ');
}

const finalContent = content;
await lib.discord.channels['@0.2.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: finalContent,
});
return finalContent;
