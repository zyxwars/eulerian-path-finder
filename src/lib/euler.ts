import type * as T from "../types";

export const getVisitedMatrix = (nodes: {
  [key: number]: T.Node;
}): { [nodeId: number]: boolean } => {
  let visited = {};
  for (let { id } of Object.values(nodes)) {
    visited[id] = false;
  }
  return visited;
};

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

export const isBridge = (
  v: number,
  u: number,
  nodes: { [nodeId: number]: T.Node }
) => {
  const c1 = dfsCount(v, getVisitedMatrix(nodes), nodes);

  nodes[v].edges.delete(u);
  nodes[u].edges.delete(v);
  const c2 = dfsCount(v, getVisitedMatrix(nodes), nodes);

  nodes[v].edges.add(u);
  nodes[u].edges.add(v);

  return c1 > c2;
};
