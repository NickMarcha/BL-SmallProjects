// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let data = await lib.googlesheets.query['@0.3.0'].select({
  spreadsheetId: `1FKR_JwhsolAy4dDx8EF_fSYtHg5N6DskY75WjRovmCo`,
  range: `Transactions!A:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{}],
  limit: {
    count: 0,
    offset: 0,
  },
});

console.log(JSON.stringify(data));
let payload = {
  type: 'line', // Show a bar chart
  data: {
    labels: [], // Set X-axis labels
    datasets: [
      {
        label: 'Amount', // Create the 'Users' dataset
        data: data.rows.map((row) => {
          return {y: row.fields.amount, x: new Date(row.fields.time)};
        }), // Add data to the chart
        label: 'Total', // Create the 'Users' dataset
        data: data.rows.map((row) => {
          return {y: row.fields.TOTAL, x: new Date(row.fields.time)};
        }),
      },
    ],
    options: {
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
        ],
      },
    },
  },
};
payload = JSON.stringify(payload);
console.log(payload);
payload = encodeURIComponent(payload);

let link = 'https://quickchart.io/chart?bkg=white&c=' + payload;
console.log(link);
//return link;
