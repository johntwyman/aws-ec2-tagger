import express from 'express';
import { getInstanceDetails, createTags, deleteTags } from './lib/awsEC2';
import getClusterNodes from './lib/k8s';

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

const clusterNodes = await getClusterNodes();
let ec2Instances = await Promise.all(clusterNodes.map(async (node) => {
  const details = await getInstanceDetails(node.nodeName);
  const ec2Instance = node;
  ec2Instance.aws = details; return ec2Instance;
}));
ec2Instances.forEach((node) => console.log(JSON.stringify(node)));

// Delete all existing tagger tags
ec2Instances.forEach((node) => deleteTags(node));
// Create new tagger tags
ec2Instances.forEach((node) => createTags(node));

// Output changes
ec2Instances = await Promise.all(clusterNodes.map(async (node) => {
  const details = await getInstanceDetails(node.nodeName);
  const ec2Instance = node;
  ec2Instance.aws = details; return ec2Instance;
}));

ec2Instances.forEach((node) => console.log(JSON.stringify(node)));
