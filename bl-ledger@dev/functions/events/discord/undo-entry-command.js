const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const discordUtil = require(`../../../Util/DiscordUtil.js`);

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
    guildConfig.fields;
  }
  console.log(guildConfig);

  console.log(`Got here: `);
  let nextEmpty = (
    await lib.googlesheets.query['@0.3.0'].count({
      spreadsheetId: guildConfig.spreadsheetId,
      range: `Transactions!A:F`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{}],
      limit: {
        count: 0,
        offset: 0,
      },
    })
  ).count;

  console.log(nextEmpty);
  if (nextEmpty < 1) {
    await discordUtil.SendSelfDestruct(`There are no entries yet`, channel_id);
    console.log(`Exited: no entries to try to undo`);
    return;
  }

  let lastEntry = await lib.googlesheets.query['@0.3.0'].select({
    spreadsheetId: guildConfig.spreadsheetId,
    range: `Transactions!A:F`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{}],
    limit: {
      count: 1,
      offset: nextEmpty - 1,
    },
  });
  lastEntry = lastEntry.rows[0].fields;
  let lastTime = new Date(lastEntry.time);

  let now = new Date();

  let diffMs = now - lastTime;

  let diffSeconds = diffMs / 1000;

  console.log(`Difference in Seconds`);
  console.log(diffSeconds);

  if (diffSeconds > 180) {
    await discordUtil.SendSelfDestruct(
      `Last entry is to old to be undone. Contact Author if needed.`,
      channel_id
    );

    console.log(`Exited: last entry to old`);
    return;
  }

  let lastEmbed = await lib.discord.channels['@0.2.2'].messages.list({
    channel_id: channel_id,
    limit: 50,
  });

  lastEmbed = lastEmbed.find(
    (m) =>
      m.author.id === process.env.BOT_ID &&
      new Date(m.embeds[0].timestamp).getTime() ===
        new Date(lastEntry.time).getTime()
  );

  if (lastEmbed) {
    let dGSQ = lib.googlesheets.query['@0.3.0'].update({
      spreadsheetId: guildConfig.spreadsheetId,
      range: `Transactions!A:F`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{}],
      limit: {
        count: 1,
        offset: nextEmpty - 1,
      },
      fields: {
        type: ``,
        time: ``,
        amount: ``,
        reason: ``,
        person: ``,
        recordAuthor: ``,
      },
    });

    await lib.discord.channels['@0.2.2'].messages.destroy({
      message_id: lastEmbed.id, // required
      channel_id: channel_id, // required
    });

    await dGSQ;
  } else {
    await discordUtil.SendSelfDestruct(
      `Embed did not match, contact author.`,
      channel_id
    );

    console.log(`Did not find Embed`);
  }
} catch (e) {
  console.log(e);
}
