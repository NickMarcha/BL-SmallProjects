const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const jsUtil = require(`../../../Util/JSUtil.js`);
const discordUtil = require(`../../../Util/DiscordUtil.js`);
//UTILITY
var formatter = jsUtil.dollarFormat;

//CONTEXT
const channel_id = context.params.event.channel_id;
console.log(`Channel ID:`);
console.log(channel_id);

const guild_id = context.params.event.guild_id;
console.log(`Guild ID:`);
console.log(guild_id);

try {
  if (!guild_id) {
    await discordUtil.SendSelfDestruct(
      `Hey! Do not disturb me, I'm playing New World!`,
      channel_id
    );
    console.log(`Exited: Command Through Private Message`);
    return;
  }

  let guildConfigQuery = await lib.googlesheets.query['@0.3.0'].select({
    spreadsheetId: process.env.DBSPREADSHEET,
    range: `ServerDB!A:E`,
    bounds: 'FULL_RANGE',
    where: [
      {
        guild_id__is: `${guild_id}`,
      },
    ],
    limit: {
      count: 0,
      offset: 0,
    },
  });

  let guildConfig;
  if (guildConfigQuery && guildConfigQuery.rows[0]) {
    guildConfig = guildConfigQuery.rows.find(
      (c) => c.fields.channel_id === channel_id
    );
  } else {
    await discordUtil.SendSelfDestruct(
      `This Discord server is not setup for BL-Ledger. Contact author.`,
      channel_id
    );
    console.log(`Exited: Server not configured`);
    return;
  }
  if (!guildConfig) {
    await discordUtil.SendSelfDestruct(
      `This channel is not set up for ledger entries.`,
      channel_id
    );
    console.log(`Exited: Channel not configured`);
    return;
  } else {
    guildConfig = guildConfig.fields;
  }
  console.log(guildConfig);

  console.log(`Got here: `);

  let rawType = context.params.event.data.options.find(
    (opt) => opt.name === 'type'
  ).value;
  let rawAmount = context.params.event.data.options.find(
    (opt) => opt.name === 'amount'
  ).value;
  let rawReason = context.params.event.data.options.find(
    (opt) => opt.name === 'reason'
  ).value;

  let type;

  let amount = parseInt(rawAmount);
  if(amount < 1){
    await discordUtil.SendSelfDestruct(
      `Amount needs to be a POSITIVE integer`,
      channel_id
    );
    console.log(`Exited: amount not positive`);
    return;
  }

  if (rawType === 'in') {
    type = `inbound`;
  } else if (rawType === 'out') {
    type = `outbound`;
    amount = -amount;
  } else {
    throw new Error(`Something went very wrong: ops ops spaghetti sos.`);
  }
  let time = context.params.event.received_at;

  let reason = rawReason;

  let rawPerson = context.params.event.data.options.find(
    (opt) => opt.name === 'transferrer'
  );
  let person = context.params.event.member.user.id;
  if (rawPerson) {
    person = rawPerson.value;
  }

  let record = {
    type: type,
    time: time,
    amount: amount,
    reason: reason,
    person: person,
    recordAuthor: context.params.event.member.user.id,
  };
  console.log('Record:');
  console.log(record);

  console.log("Sending request insertRecordQ  to " + guildConfig.spreadsheetId);
  let insertRecordQ = await lib.googlesheets.query['@0.3.0'].insert({
    spreadsheetId: guildConfig.spreadsheetId,
    range: `Transactions!A:F`,
    fieldsets: [record],
  });

  console.log(insertRecordQ);
  console.log(`index:`);
  console.log(insertRecordQ.rows[0]);
  let index = insertRecordQ.rows[0].index;

  console.log("Sending request getTotalQ to " + guildConfig.spreadsheetId);
  let getTotalQ = await lib.googlesheets.query['@0.3.0'].select({
    spreadsheetId: guildConfig.spreadsheetId,
    range: `Transactions!G:G`,
    bounds: 'FULL_RANGE',
    limit: {
      count: 1,
      offset: index - 2,
    },
  });
  console.log(`getTotalQ:`);
  console.log(getTotalQ);
  let newTotal = getTotalQ.rows[0].fields.TOTAL;
  console.log(getTotalQ.rows[0].fields);
  console.log(`newTotal:`);
  console.log(newTotal);
  let embed = {
    channel_id: `${channel_id}`,
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
            value: `<@${record.person}>`,
            inline: true,
          },
          {
            name: `Reason`,
            value: `\`${record.reason}\``,
            inline: true,
          },
          {
            name: '\u200B',
            value: '\u200B',
            inline: true,
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
  };

  console.log(embed);
  let sentMessage = await lib.discord.channels['@0.2.0'].messages.create(embed);
} catch (e) {
  console.log(e);
}
