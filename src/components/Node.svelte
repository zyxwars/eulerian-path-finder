<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { zoom } from "../stores";
  import type * as T from "../types";
  import { NODE_SIZE } from "../constants";

  export let node: T.Node;

  const dispatch = createEventDispatcher();

  const onSelect = () => {
    dispatch("node_selected", node);
  };

  const onDelete = () => {
    dispatch("node_deleted", node);
  };
</script>

<div
  on:click={onSelect}
  on:contextmenu|preventDefault={onDelete}
  on:dblclick={onDelete}
  class="node"
  style="left: {node.x}px; top: {node.y}px; background-color: {node.isSelected
    ? 'red'
    : node.edges.size % 2 == 0
    ? 'chartreuse'
    : 'yellow'}; outline-color: {node.isSelected
    ? 'darkred'
    : node.edges.size % 2 == 0
    ? 'forestgreen'
    : 'darkgoldenrod'}; 
    width: {$zoom * NODE_SIZE}px; height: {$zoom * NODE_SIZE}px; font-size: {1 *
    $zoom}rem"
>
  {node.solutionOrder ? node.solutionOrder : node.edges.size}
</div>

<style>
  .node {
    position: absolute;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;
    outline: forestgreen solid 0.2rem;
  }
</style>
