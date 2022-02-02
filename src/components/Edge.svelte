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
  class="edge-area"
  style="left: {edge.x}px; top: {edge.y}px; width: {edge.width}px; height: {edge.height}px; transform: rotate({edge.angleDeg}deg);"
>
  <div class="edge" />
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
