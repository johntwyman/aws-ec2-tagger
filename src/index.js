import cron from 'node-cron';
import express from 'express';
import refreshEC2Tags from './lib/tagger';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
// Set up cron schedule
cron.schedule('*/30 * * * *', refreshEC2Tags, { scheduled: true });
