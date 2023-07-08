const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Set a streaming status. If a twitch URL is provided it will show up as a button
return await lib.discord.users['@0.1.4'].me.status.update(context.params);
