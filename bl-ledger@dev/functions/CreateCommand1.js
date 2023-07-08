const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.commands['@0.0.0'].create({
  "name": "entry",
  "description": "Create new ledger entry",
  "options": [
    {
      "type": 3,
      "name": "type",
      "description": "Type of transfer (inbound/outbound)",
      "choices": [
        {
          "name": "in",
          "value": "in"
        },
        {
          "name": "out",
          "value": "out"
        }
      ],
      "required": true
    },
    {
      "type": 4,
      "name": "amount",
      "description": "Amount in $ (Positive integer)",
      "required": true
    },
    {
      "type": 3,
      "name": "reason",
      "description": "Reason for transfer",
      "required": true
    },
    {
      "type": 6,
      "name": "transferrer",
      "description": "Optional transferrer if making entry for someone else."
    }
  ]
});