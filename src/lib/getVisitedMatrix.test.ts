import { getVisitedMatrix } from "./getVisitedMatrix";
import { mockNode } from "./mockObjects";

test("generate visited matrix", () => {
  expect(
    getVisitedMatrix([
      { ...mockNode, id: 2 },
      { ...mockNode, id: 7 },
      { ...mockNode, id: 336 },
    ])
  ).toEqual({ 2: false, 7: false, 336: false });
});
