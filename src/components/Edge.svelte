<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { NODE_SIZE } from "../constants";
  import { zoom } from "../stores";

  import type * as T from "../types";

  export let edge: T.Edge;

  const dispatch = createEventDispatcher();

  const onDelete = () => {
    dispatch("edge_deleted", edge);
  };
</script>

<div
  on:click={onDelete}
  class="edge-area"
  style="left: {edge.x + (NODE_SIZE / 2) * $zoom}px; top: {edge.y +
    5 * $zoom}px; width: {edge.width}px; height: {edge.height *
    $zoom}px; transform: rotate({edge.angleDeg}deg);"
>
  <div class="edge" style="height: {10 * $zoom}px;" />
</div>

<style>
  .edge-area {
    position: absolute;
    height: 2rem;
    transform-origin: center left;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .edge {
    width: 100%;
    height: 10px;
    background-color: gray;
  }
</style>
