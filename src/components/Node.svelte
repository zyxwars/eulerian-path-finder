<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let node;

  const dispatch = createEventDispatcher();

  const onSelect = () => {
    dispatch("node_selected", node);
  };

  const onRemove = () => {
    dispatch("node_deleted", node);
  };
</script>

<div
  on:click={onSelect}
  on:contextmenu|preventDefault={onRemove}
  class="node"
  style="left: {node.x}px; top: {node.y}px; background-color: {node.isSelected
    ? 'red'
    : 'chartreuse'}"
>
  {node.name}
</div>

<style>
  .node {
    position: absolute;

    width: 50px;
    height: 50px;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
  }
</style>
