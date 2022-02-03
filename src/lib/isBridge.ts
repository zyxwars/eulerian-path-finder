import type * as T from "../types";
import { dfsCount } from "./dfsCount";
import { getVisitedMatrix } from "./getVisitedMatrix";

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
