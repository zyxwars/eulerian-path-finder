<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type * as T from "../types";

  export let edge: T.Edge;

  const dispatch = createEventDispatcher();

  const onDelete = () => {
    dispatch("edge_deleted", edge);
  };
</script>

<div
  on:click={onDelete}
  class="edge"
  style="left: {edge.x}px; top: {edge.y}px; width: {edge.width}px; height: {edge.height}px; transform: rotate({edge.angleDeg}deg);"
/>

<style>
  .edge {
    position: absolute;
    transform-origin: top left;

    background-color: gray;
  }
</style>
