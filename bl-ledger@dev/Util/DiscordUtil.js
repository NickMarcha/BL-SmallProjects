const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));


async function SendSelfDestruct(content, channel_id, selfDestructTime = 5) {
  const message = await lib.discord.channels['@0.2.0'].messages.create({
    channel_id,
    content: `(${selfDestructTime}s) ${content}`,
  });
  const message_id = message.id;
  // Countdown and update message
  for (let i = selfDestructTime; i > 0; i--) {
    await lib.discord.channels['@0.2.0'].messages.update({
      message_id,
      channel_id,
      content: `(${i}s) ${content}`,
    });
    await sleep(1000);
  }
  // Destrcut!
  await lib.discord.channels['@0.2.0'].messages.destroy({
    message_id,
    channel_id,
  });
}

module.exports = {SendSelfDestruct}