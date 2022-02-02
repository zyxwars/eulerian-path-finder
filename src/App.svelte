<script lang="ts">
  import { onMount } from "svelte";

  import type * as T from "./types";
  import Node from "./components/Node.svelte";
  import Edge from "./components/Edge.svelte";

  let nodes: T.Node[] = [];
  let edges: T.Edge[] = [];
  let selectedNode: T.Node | null = null;

  const handleCreateNode = (e: MouseEvent) => {
    nodes = [
      ...nodes,
      {
        solutionOrder: "",
        x: e.clientX,
        y: e.clientY,
        isSelected: false,
        edges: new Set(),
      },
    ];

    isSolvableVar = isSolvable();
  };

  // Var is used for gui so that it doesn't need to be updated on every refresh
  let isSolvableVar: string | boolean = false;
  const isSolvable = () => {
    for (let node of nodes) {
      console.log(node.edges.size);
      if (node.edges.size === 0) return "circuit not closed";
    }

    let odd = 0;
    nodes.forEach((node) => {
      if (node.edges.size % 2 === 1) {
        odd++;
      }
    });

    return odd === 2 ? "Eulerian path" : odd === 0 ? "Eulerian cycle" : false;
  };

  const isBridge = (node: T.Node) => {
    return node.edges.size < 2;
  };

  const getEulerianPath = () => {
    const solutionType = isSolvable();

    if (!solutionType) return;

    let currentNode = null;
    findStartNode: {
      for (let node of nodes) {
        if (node.edges.size % 2 === 1) {
          currentNode = node;
          break findStartNode;
        }
      }
      // If no odd nodes exist choose arbitrary node
      currentNode = nodes[0];
    }

    nodes.forEach((node) => (node.solutionOrder = ""));
    let orderIndex = 1;
    currentNode.solutionOrder = 1;

    while (true) {
      if (currentNode.edges.size === 0) break;

      // Find next node
      let nextNode = null;
      findNextNode: {
        for (let node of currentNode.edges) {
          if (!isBridge(node)) {
            nextNode = node;
            break findNextNode;
          }
        }
        // If only bridges are available, choose the first one
        [nextNode] = currentNode.edges;
      }

      currentNode.edges.delete(nextNode);
      nextNode.edges.delete(currentNode);

      //   console.log(`${currentNode.solutionOrder} -> ${nextNode.solutionOrder}`);

      // Visually change names to the order in which the graph can be drawn
      nextNode.solutionOrder =
        nextNode.solutionOrder === ""
          ? ++orderIndex
          : `${nextNode.solutionOrder},${++orderIndex}`;

      currentNode = nextNode;
    }

    nodes = [...nodes]; // Refresh state
  };

  const connectNodes = (newSelectedNode: T.Node) => {
    if (
      newSelectedNode.edges.has(selectedNode) &&
      selectedNode.edges.has(newSelectedNode)
    )
      return;

    newSelectedNode.isSelected = false;
    selectedNode.isSelected = false;

    newSelectedNode.edges.add(selectedNode);
    selectedNode.edges.add(newSelectedNode);

    // In radians, use * 180 / Math.PI to get degrees
    const angle = Math.atan2(
      selectedNode.y - newSelectedNode.y,
      selectedNode.x - newSelectedNode.x
    );

    edges = [
      ...edges,
      {
        x: selectedNode.x + 30,
        y: selectedNode.y + 30,
        width:
          (Math.abs(selectedNode.x - newSelectedNode.x) ** 2 +
            Math.abs(selectedNode.y - newSelectedNode.y) ** 2) **
          0.5,
        height: 5,
        angleDeg: 180 + (angle * 180) / Math.PI,
        node1: selectedNode,
        node2: newSelectedNode,
      },
    ];

    nodes = [...nodes]; // Refresh state
    selectedNode = null;

    isSolvableVar = isSolvable();
  };

  const handleSelectedNode = (e: CustomEvent) => {
    const newSelectedNode = e.detail;

    // Deselect node
    if (newSelectedNode === selectedNode) {
      newSelectedNode.isSelected = false;
      nodes = [...nodes]; // Refresh state
      selectedNode = null;
      return;
    }

    // Connect nodes
    if (selectedNode) return connectNodes(newSelectedNode);

    // Select node
    newSelectedNode.isSelected = true;
    nodes = [...nodes]; // Refresh state
    selectedNode = newSelectedNode;
  };

  const handleDeletedNode = (e: CustomEvent) => {
    // Delete the connection from nodes
    for (let node of nodes) {
      node.edges.delete(e.detail);
    }

    // Delete edges connecting the deleted node
    edges = edges.filter(
      (edge) => edge.node1 !== e.detail && edge.node2 !== e.detail
    );

    // Delete the node
    nodes = nodes.filter((node) => node !== e.detail);

    isSolvableVar = isSolvable();
  };

  const handleDeleteEdge = (e: CustomEvent) => {
    // Delete the connection from nodes
    for (let node of nodes) {
      if (node === e.detail.node1) node.edges.delete(e.detail.node2);
      else if (node === e.detail.node2) node.edges.delete(e.detail.node1);
    }
    nodes = [...nodes];
    console.log(nodes);

    // Delete the edge
    edges = edges.filter((edge) => edge !== e.detail);

    isSolvableVar = isSolvable();
  };
</script>

<main>
  <div class="background" on:click={handleCreateNode}>
    <h4 class="is-solvable">Is solvable: {isSolvableVar}</h4>
  </div>

  {#each edges as edge}
    <Edge {edge} on:edge_deleted={handleDeleteEdge} />
  {/each}

  {#each nodes as node}
    <Node
      {node}
      on:node_selected={handleSelectedNode}
      on:node_deleted={handleDeletedNode}
    />
  {/each}

  <button class="action-btn" on:click={() => getEulerianPath()}
    >Calculate Path</button
  >
</main>

<style>
  main {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .background {
    width: 100%;
    height: 100%;

    background-color: antiquewhite;
  }

  .is-solvable {
    position: absolute;
    top: 0;
    left: 15px;
  }

  .action-btn {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
</style>
