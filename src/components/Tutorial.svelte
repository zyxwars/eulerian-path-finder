<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const onClose = () => {
    dispatch("tutorial_closed");
  };
</script>

<div class="wrapper">
  <div class="tutorial">
    <button class="close" on:click={onClose}>[ESC]</button>
    Each node shows its degree (the number of edges connecting it to other nodes)
    <div class="line">
      <div class="node" style="background-color:yellow;" />
      Marks and odd node
    </div>
    <div class="line">
      Click on a node to select it <div
        class="node"
        style="background-color:red;"
      />
      , then click on another node to connect
      <div class="node" style="background-color:chartreuse;" />
      .
    </div>
    <div>Click on connection to remove it.</div>
    <div>Double click or right click a node to remove it.</div>
    <div>You can always bring this menu up by pressing any key.w</div>

    <a href="https://github.com/zyxwars/eulerian-path-finder" class="source"
      >Source code</a
    >
  </div>
</div>

<style>
  .node {
    width: 1rem;
    height: 1rem;

    border-radius: 50%;
  }
  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-weight: 900;
  }

  .line {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tutorial {
    position: relative;
    width: 50%;
    height: 75%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background-color: rgb(0, 0, 0);
    opacity: 70%;
    border-radius: 1rem;
  }
  .source {
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
  }
</style>
