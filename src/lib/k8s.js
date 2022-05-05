import * as k8s from "@kubernetes/client-node";

const uniq = (a) => Array.from(new Set(a));

export default async function getClusterNodes(namespace = "default") {

  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  const pods = await k8sApi.listNamespacedPod(namespace);

  let nodes = [];
  for (const pod of pods.body.items) {
    let podName = pod.metadata.labels.app ? pod.metadata.labels.app : pod.metadata.name;
    let releaseName = pod.metadata.labels.release ? pod.metadata.labels.release : undefined;
    const node = nodes.find((x) => x.nodeName === pod.spec.nodeName);
    if (node) {
      node.pods.push(podName);
      node.releases.push(releaseName);
    } else nodes.push({ nodeName: pod.spec.nodeName, pods: [podName], releases: [releaseName] });
  }

  for (const node of nodes) {
    node.pods = uniq(node.pods);
    node.releases = uniq(node.releases);
  }

  return nodes;
}
