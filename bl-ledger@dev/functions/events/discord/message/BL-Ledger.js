//Was message create
//UTILITY
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
return; //Disabled

function parseRecord(raw) {
  let lines = raw.split(/\r?\n/);
  let type = lines[0].toLowerCase();

  if (type.includes('inbound') || type.includes('deposit')) {
    type = 'inbound';
  } else if (type.includes('outbound') || type.includes('withdrawal')) {
    type = 'outbound';
  } else {
    throw new Error(`Parse failed, no type`);
  }
  let time = lines[4].replace(' ', 'T') + '.000Z';
  let amount = lines[6].replace(',', '').replace('$', '');
  if (type === 'outbound') {
    amount = -amount;
  }
  amount = amount;

  let person = lines[1].replace(' ', '');

  if (/^<@!\d*>$/.test(person)) {
    //console.log(person);
  } else {
    person = `<@${context.params.event.author.id}>`;
  }

  let lastStrings = lines[7].split(' ');
  let reason = 'None Given';
  if (lastStrings.length > 6) {
    reason = lines[7].substr(38);
  } else {
    console.log(`Missing reason: ` + lines[7]);
  }
  return {
    type: type,
    time: time,
    amount: amount,
    reason: reason,
    person: person,
    transactionID: lines[2],
    fromID: lastStrings[3],
    toID: lastStrings[5],
    recordAuthor : context.params.event.author.id,
  };
}

try {
  let record = parseRecord(context.params.event.content);
  console.log('Record:');
  console.log(record);

  let insertRecordQ = await lib.googlesheets.query['@0.3.0'].insert({
    range: `Transactions!A:I`,
    fieldsets: [record],
  });

  let index = insertRecordQ.rows[0].index;

  let getTotalQ = await lib.googlesheets.query['@0.3.0'].select({
    range: `Transactions!J:J`,
    bounds: 'FULL_RANGE',
    limit: {
      count: 1,
      offset: index,
    },
  });

  let newTotal = getTotalQ.rows[0].fields.TOTAL;

  await lib.discord.channels['@0.2.0'].messages.destroy({
    message_id: context.params.event.id, // required
    channel_id: context.params.event.channel_id, // required
  });
  let sentMessage = await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: '',
        description: '',
        color: record.amount < 0 ? 0xd90e0e : 0x00d712,
        fields: [
          {
            name: `Name`,
            value: `${record.person}`,
            inline: true,
          },
          {
            name: `Reason`,
            value: `\`${record.reason}\``,
            inline: true,
          },
          {
            name: '--------------------------------------------------',
            value: `||${record.transactionID}||`,
          },
          {
            name: `Amount`,
            value: `\`${formatter.format(record.amount)}\``,
            inline: true,
          },
          {
            name: `Current Total`,
            value: `\`${formatter.format(parseInt(newTotal))}\``,
            inline: true,
          },
        ],
        timestamp: `${record.time}`,
      },
    ],
  });
} catch (e) {
  console.log(`Something Went to Shit:`);
  if (e.message === 'Parse failed, no type') {
    console.log(e);
    console.log(`Not a Ledger entry?`);
  } else {
    console.log(e);
    await lib.discord.channels['@0.2.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `Sorry <@${context.params.event.author.id}>. I was not able to parse your entry...`,
    });
  }
}
