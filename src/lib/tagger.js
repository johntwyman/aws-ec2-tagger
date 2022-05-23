import { getInstanceDetails, createTags, deleteTags } from './awsEC2';
import getClusterNodes from './k8s';

export default async function refreshEC2Tags() {
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
}
