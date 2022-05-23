import {
  EC2Client, DescribeInstancesCommand, CreateTagsCommand, DeleteTagsCommand,
} from '@aws-sdk/client-ec2';

const REGION = 'ap-southeast-2';
const ec2Client = new EC2Client({ region: REGION });

export async function getInstanceDetails(privateDnsName) {
  const params = {
    Filters: [
      {
        Name: 'private-dns-name',
        Values: [privateDnsName],
      },
    ],
  };
  try {
    const data = await ec2Client.send(new DescribeInstancesCommand(params));
    const result = {
      instanceId: data.Reservations[0].Instances[0].InstanceId,
      tags: data.Reservations[0].Instances[0].Tags,
    };
    return result;
  } catch (err) {
    console.log('Error', err);
    return null;
  }
}

export async function deleteTags(node, tagPrefix = 'k8s.io/aws-ec2-tagger:') {
  const { instanceId } = node.aws;
  const tagsToDelete = node.aws.tags.filter((tag) => tag.Key.startsWith(tagPrefix));
  const params = {
    Resources: [instanceId],
    Tags: tagsToDelete,
  };
  try {
    const result = await ec2Client.send(new DeleteTagsCommand(params));
    console.log('Instance tags deleted');
    console.log(JSON.stringify(result));
  } catch (err) {
    console.log('Error', err);
  }
}

export async function createTags(node, tagPrefix = 'k8s.io/aws-ec2-tagger:') {
  const { instanceId } = node.aws;
  const tagsToCreate = node.releases.map((release) => ({ Key: tagPrefix + release }));
  const params = {
    Resources: [instanceId],
    Tags: tagsToCreate,
  };
  try {
    const result = await ec2Client.send(new CreateTagsCommand(params));
    console.log('Instance tags created');
    console.log(JSON.stringify(result));
  } catch (err) {
    console.log('Error', err);
  }
}
