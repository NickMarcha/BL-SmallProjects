//Was message create
// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let author = context.params.event.author.id;
let channelID = context.params.event.channel_id;
let message = context.params.event.content;
if (!context.params.event.guild_id && message.split(' ')[0] === '!scan') {
  console.log('Author');
  console.log(author);

  console.log('Channel');
  console.log(channelID);

  let url = message.split(' ')[1];

  console.log(url);
  // Imports the Google Cloud client libraries
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
  // const fileName = 'Path to file within bucket, e.g. path/to/image.png';

  // Performs text detection on the gcs file
  const [result] = await client.textDetection(`gs://${url}`);
  const detections = result.textAnnotations;
  console.log('Text:');
  detections.forEach((text) => console.log(text));
}
