<script>
  import { onMount } from "svelte";

  import Node from "./components/Node.svelte";

  let canvas;
  let nodes = [];
  let selectedNode = null;
  let nodeName = 0;

  window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const handleCreateNode = (e) => {
    nodes = [
      ...nodes,
      {
        name: ++nodeName,
        x: e.clientX,
        y: e.clientY,
        isSelected: false,
        edges: new Set(),
      },
    ];
  };

  // Var is used for gui so that it doesn't need to be updated on every refresh
  let isSolvableVar = false;
  const isSolvable = () => {
    let odd = 0;
    nodes.forEach((node) => {
      if (node.edges.size % 2 === 1) {
        odd++;
      }
    });

    return odd === 2 ? "Eulerian path" : odd === 0 ? "Eulerian cycle" : false;
  };

  const isBridge = (node) => {
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

    nodes.forEach((node) => (node.name = ""));
    let orderIndex = 1;
    currentNode.name = 1;

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

      //   console.log(`${currentNode.name} -> ${nextNode.name}`);

      // Visually change names to the order in which the graph can be drawn
      nextNode.name =
        nextNode.name === ""
          ? ++orderIndex
          : `${nextNode.name},${++orderIndex}`;

      currentNode = nextNode;
    }

    nodes = [...nodes]; // Refresh state
  };

  const handleSelectNode = (e) => {
    const newSelectedNode = e.detail;

    // Deselect node
    if (newSelectedNode === selectedNode) {
      newSelectedNode.isSelected = false;
      nodes = [...nodes]; // Refresh state
      selectedNode = null;
      return;
    }

    // Connect nodes
    if (selectedNode) {
      const ctx = canvas.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(selectedNode.x + 25, selectedNode.y + 25);
      ctx.lineTo(newSelectedNode.x + 25, newSelectedNode.y + 25);
      ctx.stroke();

      newSelectedNode.isSelected = false;
      newSelectedNode.edges.add(selectedNode);
      selectedNode.isSelected = false;
      selectedNode.edges.add(newSelectedNode);

      nodes = [...nodes]; // Refresh state
      selectedNode = null;

      isSolvableVar = isSolvable();
      return;
    }

    // Select node
    newSelectedNode.isSelected = true;
    nodes = [...nodes]; // Refresh state
    selectedNode = newSelectedNode;
  };

  const handleDeleteNode = (e) => {
    nodes = nodes.filter((node) => node !== e.detail);
  };
</script>

<main>
  <canvas bind:this={canvas} on:click={handleCreateNode} />
  <h4 class="is-solvable">Is solvable: {isSolvableVar}</h4>
  {#each nodes as node}
    <Node
      {node}
      on:node_selected={handleSelectNode}
      on:node_deleted={handleDeleteNode}
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
