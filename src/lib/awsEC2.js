import { EC2Client, DescribeInstancesCommand, CreateTagsCommand, DeleteTagsCommand } from "@aws-sdk/client-ec2";
const REGION = "ap-southeast-2";
const ec2Client = new EC2Client({ region: REGION });

export async function getInstanceDetails(privateDnsName) {
  const params = {
    Filters: [
      { Name: "private-dns-name",
        Values: [privateDnsName]
      }
    ]
  };
  try {
    const data = await ec2Client.send(new DescribeInstancesCommand(params));
    console.log("Instance retrieved");
    let result = {
      instanceId: data.Reservations[0].Instances[0].InstanceId,
      tags: data.Reservations[0].Instances[0].Tags
    };
    return result;
  } catch (err) {
    console.log("Error", err);
    return null;
  }
}