import { dfsCount } from "./dfsCount";
import { mockNode } from "./mockObjects";

describe("Test dfsCount of 3 nodes", () => {
  test("dfsCount from side node", () => {
    expect(
      dfsCount(
        1,
        { 1: false, 3: false, 8: false },
        {
          1: { ...mockNode, id: 1, edges: new Set([8]) },
          3: { ...mockNode, id: 3, edges: new Set([8]) },
          8: { ...mockNode, id: 8, edges: new Set([1, 3]) },
        }
      )
    ).toBe(3);
  });

  test("dfsCount from center node", () => {
    expect(
      dfsCount(
        8,
        { 1: false, 3: false, 8: false },
        {
          1: { ...mockNode, id: 1, edges: new Set([8]) },
          3: { ...mockNode, id: 3, edges: new Set([8]) },
          8: { ...mockNode, id: 8, edges: new Set([1, 3]) },
        }
      )
    ).toBe(3);
  });

  test("dfsCount with destroyed bridge", () => {
    expect(
      dfsCount(
        1,
        { 1: false, 3: false, 8: false },
        {
          1: { ...mockNode, id: 1, edges: new Set([8]) },
          3: { ...mockNode, id: 3, edges: new Set() },
          8: { ...mockNode, id: 8, edges: new Set([1]) },
        }
      )
    ).toBe(2);
  });

  test("dfsCount with destroyed bridge from the other side", () => {
    expect(
      dfsCount(
        3,
        { 1: false, 3: false, 8: false },
        {
          1: { ...mockNode, id: 1, edges: new Set([8]) },
          3: { ...mockNode, id: 3, edges: new Set() },
          8: { ...mockNode, id: 8, edges: new Set([1]) },
        }
      )
    ).toBe(1);
  });
});
