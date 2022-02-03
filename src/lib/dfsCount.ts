import type * as T from "../types";

export const dfsCount = (
  v: number,
  visited: { [nodeId: number]: boolean },
  nodes: { [nodeId: number]: T.Node }
) => {
  let count = 1;
  visited[v] = true;

  for (let node of nodes[v].edges) {
    if (visited[node] === false) count += dfsCount(node, visited, nodes);
  }
  return count;
};
