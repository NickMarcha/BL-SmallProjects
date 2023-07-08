// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {registerFont, createCanvas, loadImage} = require('canvas');

let data = await lib.googlesheets.query['@0.3.0'].select({
  spreadsheetId: process.env.DBSPREADSHEET,
  range: `MaterialOrders!A:I`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      Hidden__is: `FALSE`,
    },
  ],
  limit: {
    count: 0,
    offset: 0,
  },
});

console.log(JSON.stringify(data));

// We're going to use the best font ever for our image... Comic Sans!
// Let's import it now so that we can use it in our app!
const comicsans = require('@canvas-fonts/comic-sans-ms');
registerFont(comicsans, {family: 'Comic Sans'});
console.log(`Got here: A`);
const count = data.rows.length;
// Cool, next up we need to create a canvas that we're going to draw on
// We're then going to get our Canvas' 2d context so we can draw on it
let spacing = 150;
const canvas = createCanvas(700, 45 + count * spacing);
const ctx = canvas.getContext('2d');
console.log(`Got here: B`);
// Awesome, now lets fill in our canvas background with a colour of our choice
ctx.fillStyle = '#311b1b'; //'#34495E';
ctx.fillRect(0, 0, canvas.width, canvas.height);
console.log(`Got here: C`);
// Time to write some text to welcome our user
ctx.font = 'bold 30px "Comic Sans"';
ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'left';
//ctx.fillText(`Welcome`, );
let fhpos = 35;
ctx.fillText('Odd Job Orders', 160, 35);
ctx.textAlign = 'right';
var d = new Date(); /* midnight in China on April 13th */
ctx.font = 'bold 15px "Comic Sans"';
ctx.fillText(
  'Time EST:\n' + d.toLocaleString('en-US', {timeZone: 'America/New_York'}),
  685,
  20
);
ctx.textAlign = 'left';
ctx.font = 'bold 30px "Comic Sans"';
/*
ctx.textAlign = 'right';
ctx.fillText('Time Left', 295, fhpos);
ctx.textAlign = 'left';
ctx.fillText('Seller', 300, fhpos);
ctx.textAlign = 'right';
ctx.fillText('Current Bid', 550, fhpos);
ctx.fillText('Buyout', 700, fhpos);
*/
for (let i = 0; i < count; i++) {
  let hpos = 50 + i * spacing;
  let imgUrl = data.rows[i].fields.Image;
  console.log(imgUrl);
  if (imgUrl === '') {
    imgUrl = 'https://i.imgur.com/kgpDSj5.png';
  }
  let image = await loadImage(imgUrl);
  let imgSize = 140;
  ctx.drawImage(image, 10, hpos, imgSize, imgSize);
  ctx.fillStyle = '#5e3434';
  ctx.fillRect(imgSize + 20, hpos, canvas.width - (imgSize + 30), spacing - 10);

  ctx.font = 'bold 30px "fantasy"';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  //ctx.fillText(`Welcome`, );

  ctx.fillText(data.rows[i].fields.Order, imgSize + 25, hpos + 30, 300);
  let timeLeft = data.rows[i].fields['Time Left'];
  if (timeLeft) {
    ctx.fillText('Time Left:\n' + timeLeft, imgSize + 30, hpos + 100, 300);
  }

  ctx.textAlign = 'left';
  ctx.fillText(
    'Payment:\n' + data.rows[i].fields['Payment'],
    500,
    hpos + 30,
    200
  );
  /*
  let buyout = data.rows[i].fields['Buyout'];
  if (buyout !== '') {
    ctx.fillText('Buyout:\n' + buyout, 500, hpos + 100, 200);
  }*/
}

console.log(`Got here: D`);
/*
// Then we'll download the image into Autocode
// Once it's downloaded we'll overlay it onto our welcome message
let avatar_url ="https://upload.wikimedia.org/wikipedia/commons/5/5b/Waffles_with_Strawberries.jpg"
let image = await loadImage(avatar_url);
ctx.drawImage(image, 150, 25, 70, 70);
*/
console.log(`Got here: E`);

return {
  body: await canvas.toBuffer(),
  headers: {
    'Content-Type': 'image/png',
    'Cache-Control': 'no-cache, max-age=120',
  },
};
