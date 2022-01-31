<script>
  import { createEventDispatcher } from "svelte";

  export let node;

  const dispatch = createEventDispatcher();

  const handleSelect = () => {
    node.isSelected = true;
    dispatch("node_selected", node);
  };
</script>

<div
  on:click={handleSelect}
  class="node"
  style="left: {node.x}px; top: {node.y}px; background-color: {node.isSelected
    ? 'red'
    : 'chartreuse'}"
/>

<style>
  .node {
    position: absolute;

    width: 5rem;
    height: 5rem;
  }
</style>
