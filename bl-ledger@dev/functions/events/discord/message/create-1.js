//Was message create
// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let author = context.params.event.author.id;
let channelID = context.params.event.channel_id;
let message = context.params.event.content;
if (!context.params.event.guild_id && message === '!clear') {
  console.log('Author');
  console.log(author);

  console.log('Channel');
  console.log(channelID);

  let messages = await lib.discord.channels['@0.2.2'].messages.list({
    channel_id: `${channelID}`,
    limit: 10,
  });
  console.log(messages);
  let filteredMessages = messages.filter(
    (m) => m.author.id === process.env.BOT_ID
  );
  console.log(filteredMessages);
  let requests = filteredMessages.map((m) =>
    lib.discord.channels['@0.2.2'].messages.destroy({
      message_id: m.id, // required
      channel_id: channelID, // required
    })
  );

  let rpa = await Promise.all(requests).then((response) =>
    console.log(response)
  );
  console.log(rpa);
}
