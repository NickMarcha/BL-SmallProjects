// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
return;//disabled
let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: [
    ` `,
    `Hey <@!${context.params.event.author.id}>! I'm a bot authored by <@!287734165414215681>`,
  ].join('\n'),
  embed: {
    title: 'What am I for?',
    type: 'rich',
    color: 0x00aa00, // Green color
    description: 'Updating the ledger with no effort!',
    fields: [
      {
        name: 'How to use',
        value: [
          'Simply copy an entry from the Badlands Bank transaction log and paste it here!',
        ].join('\n'),
      },
    ],
  },
  tts: false,
});

return messageResponse;
