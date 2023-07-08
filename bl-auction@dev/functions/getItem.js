/**
 * An HTTP endpoint that acts as a webhook for HTTP(S) request event
 * @param {number} id
 * @returns {any} result
 */

const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let response = {error: "Something went wrong"}
module.exports = async (id, context) => {
results = (await lib.googlesheets.query['@0.3.0'].select({
    spreadsheetId: process.env.DBSPREADSHEET,
    range: `ItemAuction!A:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        Hidden__is: `FALSE`,
        ID__is: id.toString()
      },
    ],
    limit: {
      count: 0,
      offset: 0,
    },
  })).rows;
  if(results.length === 1) {
    response = results[0].fields
  } else if (results.length === 0) {
    {error: "Could not find item"}
  }
  
  
  console.log(response)
  return response;
};

/*
await lib.googlesheets.query['@0.3.0'].select({
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
*/