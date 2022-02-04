<script lang="ts">
  import { zoom } from "../stores";

  let isIncrementing = false;
  let isDecrementing = false;
  let changeSens = 1;
  const changeZoom = (dir: number = 1) => {
    if (isIncrementing && isDecrementing) {
      isIncrementing = false;
      isDecrementing = false;
    }

    if ((!isIncrementing && dir > 0) || (!isDecrementing && dir < 0))
      return (changeSens = 1);

    zoom.update((v) => v + 0.1 * dir);
    changeSens += 0.5;

    setTimeout(() => changeZoom(dir), 200 * changeSens ** -1);
  };
</script>

<div class="wrapper">
  <div>
    Zoom: {$zoom.toFixed(1)}
  </div>
  <button
    on:pointerdown|preventDefault={() => {
      isIncrementing = true;
      changeZoom();
    }}
    on:pointerup={() => (isIncrementing = false)}>+</button
  >
  <button
    on:pointerdown|preventDefault={() => {
      isDecrementing = true;
      changeZoom(-1);
    }}
    on:pointerup={() => (isDecrementing = false)}>-</button
  >
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  button {
    width: 2rem;
    height: 2rem;
    padding: 0;
    margin: 0;
    margin-left: 0.5rem;
  }
</style>
