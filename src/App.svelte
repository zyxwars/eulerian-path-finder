<script>
  import { onMount } from "svelte";

  import Node from "./components/Node.svelte";

  let canvas;
  let nodes = [];
  let selectedNode = null;

  onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const handleClickCanvas = (e) => {
    nodes = [...nodes, { x: e.clientX, y: e.clientY, isSelected: false }];
  };

  const handleNodeSelect = (e) => {
    const newSelectedNode = e.detail;

    if (selectedNode) {
      const ctx = canvas.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(selectedNode.x + 25, selectedNode.y + 25);
      ctx.lineTo(newSelectedNode.x + 25, newSelectedNode.y + 25);
      ctx.stroke();

      newSelectedNode.isSelected = false;
      selectedNode.isSelected = false;

      // Refresh state
      nodes = [...nodes];
      selectedNode = null;
      return;
    }

    selectedNode = newSelectedNode;
  };
</script>

<main>
  <canvas bind:this={canvas} on:click={handleClickCanvas} />
  {#each nodes as node}
    <Node {node} on:node_selected={handleNodeSelect} />
  {/each}
</main>

<style>
  main {
    position: relative;
    width: 100%;
    height: 100vh;

    background-color: antiquewhite;
  }
</style>
