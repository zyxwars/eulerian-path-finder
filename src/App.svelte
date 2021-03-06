<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  import type * as T from "./types";
  import Node from "./components/Node.svelte";
  import Edge from "./components/Edge.svelte";
  import Tutorial from "./components/Tutorial.svelte";
  import { isBridge, dfsCount, getVisitedMatrix } from "./lib/euler";
  import { zoom } from "./stores";
  import Zoom from "./components/Zoom.svelte";

  let nodes: { [nodeId: number]: T.Node } = {};
  let nodeId = 0;
  let selectedNode: T.Node | null = null;
  // Edges aren't used for any logic and are just visual
  // Use node.edges for any logic
  let edges: T.Edge[] = [];

  let isTutorialVisible = true;
  let isShowingResult = false;
  let preResultNodes: { [nodeId: number]: T.Node } = [];
  let solutionAnimation: T.SolutionPos[] = [];
  let notDeletable: T.Node | null = null;
  const solutionNode = spring({ x: 0, y: 0 });
  // Var is used for gui, isSolvable is the function
  $: isSolvableVar = isSolvable(Object.values(nodes));

  onMount(() => {
    window.addEventListener("keypress", (e: KeyboardEvent) => {
      isTutorialVisible = !isTutorialVisible;
    });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        isTutorialVisible = !isTutorialVisible;
      }
    });
    window.addEventListener("mousedown", () => {
      if (!isShowingResult) return;

      isShowingResult = false;
      nodes = { ...preResultNodes };
    });
  });

  const isSolvable = (nodesArray: T.Node[]) => {
    if (isShowingResult) return "showing solution";

    if (nodesArray.length === 0) return false;

    // Number(Object.keys(nodes)[0]) gets first element's id from the dict
    // Id doesn't have to be zero as you can delete nodes so nodes[0] might throw and error
    const isClosed =
      dfsCount(
        Number(Object.keys(nodes)[0]),
        getVisitedMatrix(nodes),
        nodes
      ) === nodesArray.length;
    if (!isClosed) return "circuit not closed";

    let odd = 0;
    for (let node of nodesArray) {
      if (node.edges.size % 2 === 1) {
        odd++;
      }
    }

    return odd === 2 ? "Eulerian path" : odd === 0 ? "Eulerian cycle" : false;
  };

  const getPath = () => {
    if (isShowingResult) return;
    solutionAnimation = [];
    if (!isSolvableVar) return;
    if (selectedNode) {
      selectedNode.isSelected = false;
      selectedNode = null;
    }

    const nodesArray = Object.values(nodes);

    // Cache nodes by value
    preResultNodes = {};
    for (let node of nodesArray) {
      preResultNodes[node.id] = { ...node, edges: new Set([...node.edges]) };
    }

    let currentNode = null;
    findStartNode: {
      for (let node of nodesArray) {
        // Use odd node as the start point
        if (node.edges.size % 2 === 1) {
          currentNode = node;
          break findStartNode;
        }
      }
      // If no odd nodes exist choose arbitrary node
      currentNode = nodesArray[0];
    }

    nodesArray.forEach((node) => (node.solutionOrder = ""));
    let orderIndex = 0;

    while (true) {
      // Visually change names to the order in which the graph can be drawn
      currentNode.solutionOrder =
        currentNode.solutionOrder === ""
          ? ++orderIndex
          : `${currentNode.solutionOrder},${++orderIndex}`;

      solutionAnimation.push({
        x: currentNode.x,
        y: currentNode.y,
        order: orderIndex,
      });

      // If all goes to plan the path is finished
      if (currentNode.edges.size === 0) break;

      // Find next node
      let nextNode = null;
      findNextNode: {
        // Nodes are edited during dfs count, causes infinite loop if copy is not made
        const edges = [...currentNode.edges];

        for (let nodeId of edges) {
          // Find node that is not a bridge to move to
          if (!isBridge(currentNode.id, nodeId, nodes)) {
            nextNode = nodes[nodeId];
            break findNextNode;
          }
        }
        // If only bridges are available, choose the first one
        const [nextNodeId] = currentNode.edges;
        nextNode = nodes[nextNodeId];
      }

      currentNode.edges.delete(nextNode.id);
      nextNode.edges.delete(currentNode.id);

      console.log(`${currentNode.id} -> ${nextNode.id}`);

      currentNode = nextNode;
    }

    nodes = { ...nodes }; // Refresh state
    isShowingResult = true;
    animateSolution(solutionAnimation[0]);
  };

  const preventDelete = (node: T.Node) => {
    notDeletable = node;
    setTimeout(() => (notDeletable = null), 200);
  };

  const handleCreateNode = (e: MouseEvent) => {
    const id = ++nodeId;
    nodes[id] = {
      id,
      solutionOrder: "",
      x: e.pageX,
      y: e.pageY,
      isSelected: false,
      edges: new Set(),
    };
  };

  const connectNodes = (newSelectedNode: T.Node) => {
    preventDelete(newSelectedNode);

    if (
      newSelectedNode.edges.has(selectedNode.id) &&
      selectedNode.edges.has(newSelectedNode.id)
    )
      return;

    newSelectedNode.isSelected = false;
    selectedNode.isSelected = false;

    newSelectedNode.edges.add(selectedNode.id);
    selectedNode.edges.add(newSelectedNode.id);

    // In radians, use * 180 / Math.PI to get degrees
    const angle = Math.atan2(
      selectedNode.y - newSelectedNode.y,
      selectedNode.x - newSelectedNode.x
    );

    edges = [
      ...edges,
      {
        x: selectedNode.x,
        y: selectedNode.y,
        width:
          (Math.abs(selectedNode.x - newSelectedNode.x) ** 2 +
            Math.abs(selectedNode.y - newSelectedNode.y) ** 2) **
          0.5,
        height: 50,
        angleDeg: 180 + (angle * 180) / Math.PI,
        node1Id: selectedNode.id,
        node2Id: newSelectedNode.id,
      },
    ];

    nodes = { ...nodes }; // Refresh state
    selectedNode = null;
  };

  const handleSelectNode = (e: CustomEvent) => {
    const newSelectedNode = e.detail;

    // Deselect node
    if (newSelectedNode === selectedNode) {
      newSelectedNode.isSelected = false;
      nodes = { ...nodes }; // Refresh state
      selectedNode = null;
      return;
    }

    // Connect nodes
    if (selectedNode) return connectNodes(newSelectedNode);

    // Select node
    newSelectedNode.isSelected = true;
    nodes = { ...nodes }; // Refresh state
    selectedNode = newSelectedNode;
  };

  const handleDeleteNode = (e: CustomEvent) => {
    if (e.detail === notDeletable) return (notDeletable = null);

    // Delete the connection from nodes
    for (let node of Object.values(nodes)) {
      node.edges.delete(e.detail.id);
    }

    // Delete edges connecting the deleted node
    edges = edges.filter(
      (edge) => edge.node1Id !== e.detail.id && edge.node2Id !== e.detail.id
    );

    if (e.detail.isSelected) selectedNode = null;
    // Delete the node
    delete nodes[e.detail.id];
    nodes = { ...nodes };
  };

  const handleDeleteEdge = (e: CustomEvent) => {
    // Delete the connection from nodes
    for (let node of Object.values(nodes)) {
      if (node.id === e.detail.node1Id) node.edges.delete(e.detail.node2Id);
      else if (node.id === e.detail.node2Id)
        node.edges.delete(e.detail.node1Id);
    }
    nodes = { ...nodes };

    // Delete the edge
    edges = edges.filter((edge) => edge !== e.detail);
  };

  const handleClearAll = () => {
    nodes = {};
    nodeId = 0;
    selectedNode = null;
    edges = [];
    notDeletable = null;
  };

  const animateSolution = (pos: T.SolutionPos) => {
    if (!isShowingResult) return;

    solutionNode.set({ x: pos.x, y: pos.y });

    let i = solutionAnimation.indexOf(pos) + 1;
    if (solutionAnimation.length == i) i = 0;

    setTimeout(() => animateSolution(solutionAnimation[i]), 500);
  };
</script>

<main>
  {#if isTutorialVisible}
    <Tutorial on:tutorial_closed={() => (isTutorialVisible = false)} />
  {/if}

  <div class="background" on:click={handleCreateNode} />

  {#each edges as edge}
    <Edge {edge} on:edge_deleted={handleDeleteEdge} />
  {/each}

  {#each Object.values(nodes) as node}
    <Node
      {node}
      on:node_selected={handleSelectNode}
      on:node_deleted={handleDeleteNode}
    />
  {/each}

  <h4 class="is-solvable">
    Is solvable: {isSolvableVar} <br />
    <Zoom />
  </h4>

  {#if isShowingResult}
    <div
      class="solution-node"
      style="top: {$solutionNode.y}px; left: {$solutionNode.x}px; width: {$zoom *
        60}px; height: {$zoom * 60}px"
    />
  {/if}

  <button on:click={handleClearAll} class="erase-btn"
    ><i class="fas fa-eraser fa-lg" /></button
  >

  <button class="action-btn" on:click={() => getPath()}>Calculate Path</button>
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
  }

  .solution-node {
    position: absolute;

    border-radius: 50%;
    background-color: red;
  }

  .background {
    width: 100%;
    height: 100%;

    background-color: antiquewhite;
  }

  .is-solvable {
    position: fixed;
    top: 0;
    left: 15px;
    font-weight: 500;
    font-size: 1rem;
  }

  .erase-btn {
    width: 3rem;
    height: 3rem;
    padding: 0;
    position: fixed;
    top: 15px;
    right: 15px;
  }

  .action-btn {
    position: fixed;
    bottom: 15px;
    right: 15px;
  }
</style>
