import * as cron from 'node-cron';
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

(async () => {
  app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
  // Set up cron schedule
  const task = cron.schedule('*/30 * * * *', refreshEC2Tags(), { scheduled: false });
  task.start();
  process.on('SIGTERM', () => {
    task.destroy();
  });
  process.on('SIGINT', () => {
    task.destroy();
  });
})();
