'use strict';

import { getInstanceDetails } from './lib/awsEC2.js';
import getClusterNodes from './lib/k8s.js';
import express from 'express';


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

let clusterNodes = await getClusterNodes();
let output = await Promise.all(clusterNodes.map( async (node) => {
  let details = await getInstanceDetails(node.nodeName);
  node.aws = details; return node
}));
output.forEach((node) => console.log(JSON.stringify(node)));
