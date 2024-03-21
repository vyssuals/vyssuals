<script>
  import { startColor, endColor } from "../store";

  export let buttonText = "Add Chart";

  $: scolor = `${$startColor}99`;
  $: ecolor = `${$endColor}99`;
</script>

<div>
  <button
  style="background-image: linear-gradient(to right, {scolor}, {ecolor})"
    on:click>{buttonText}</button
  >
</div>

<style>
  div {
    display: flex;
    justify-content: center;
  }

  button {
    /* border: 1.7px solid; */
    /* border-color: black; */
    color: var(--color);
    background-color: var(--card-background-color);
  }
  button:hover {
    color: black;
  }
</style>
