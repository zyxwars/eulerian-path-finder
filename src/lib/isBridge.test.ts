import { mockNode } from "./mockObjects";
import { isBridge } from "./isBridge";

describe("Test if different nodes are a bridge", () => {
  const nodes = {
    1: { ...mockNode, id: 1, edges: new Set([4, 3]) },
    3: { ...mockNode, id: 3, edges: new Set([1, 4]) },
    4: { ...mockNode, id: 4, edges: new Set([1, 3, 6]) },
    6: { ...mockNode, id: 6, edges: new Set([4, 9, 25]) },
    9: { ...mockNode, id: 9, edges: new Set([6, 25]) },
    25: { ...mockNode, id: 25, edges: new Set([6, 9]) },
  };

  test("bridge", () => {
    expect(isBridge(4, 6, nodes)).toBeTruthy();
  });

  test("bridge opposite", () => {
    expect(isBridge(6, 4, nodes)).toBeTruthy();
  });

  test("no bridge", () => {
    expect(isBridge(9, 25, nodes)).toBeFalsy();
  });

  test("part of bridge", () => {
    expect(isBridge(4, 3, nodes)).toBeFalsy();
  });
});
