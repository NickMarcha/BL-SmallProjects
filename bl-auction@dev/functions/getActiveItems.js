const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (context) => {
return (await lib.googlesheets.query['@0.3.0'].select({
    spreadsheetId: process.env.DBSPREADSHEET,
    range: `ItemAuction!A:K`,
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
  })).rows.map(i => i.fields).map(i => {
    let { Hidden, Date, Time, Seller, Buyout, Bidder, ...newI } = i
    return newI;
  });
};

/*
{
  "Hidden": "FALSE",
  "ID": "46",
  "Item": "5G Signal Blocker",
  "Date": "2022-07-24",
  "Time": "02:00P",
  "Image": "https://i.imgur.com/rI7MQNt.png",
  "Seller": "",
  "Buyout": "",
  "Current Bid": "$30,000",
  "Bidder": "",
  "Time Left": "6 day(s) 1 Hour(s) 8 Minutes(s)"
}
*/