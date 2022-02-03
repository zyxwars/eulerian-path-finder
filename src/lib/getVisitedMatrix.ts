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
