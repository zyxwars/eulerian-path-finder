<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";

  const dispatch = createEventDispatcher();

  const onClose = () => {
    dispatch("tutorial_closed");
  };
</script>

<div class="wrapper" in:scale out:scale>
  <div class="tutorial">
    <button class="close" on:click={onClose}>[ESC]</button>

    <h3>
      Visual implementation of <a
        href="https://en.wikipedia.org/wiki/Eulerian_path#Fleury's_algorithm"
      >
        Fleury's algorithm
      </a>
    </h3>

    <h3>Basic controls:</h3>
    <ol>
      <li>Left click to <strong>create node.</strong></li>
      <li>Right or double click to <strong>delete node.</strong></li>
      <li>Select two nodes to <strong>connect</strong> them.</li>
      <li>Click on an edge to <strong>delete</strong> it.</li>
    </ol>

    <a href="https://github.com/zyxwars/eulerian-path-finder" class="source"
      >Source code</a
    >
  </div>
</div>

<style>
  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-weight: 900;
  }

  .wrapper {
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tutorial {
    position: relative;
    width: 90%;
    height: 75%;
    padding: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    font-size: 1rem;

    opacity: 70%;
    background-color: rgb(0, 0, 0);
    border-radius: 1rem;
  }
  .tutorial h3 {
    font-weight: 500;
    margin-bottom: 0;
  }

  .source {
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
  }

  @media only screen and (min-width: 1400px) {
    .tutorial {
      width: 50%;
      font-size: 1.2rem;
    }
  }
</style>
