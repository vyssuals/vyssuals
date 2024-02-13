<script>
  import { showChartEditor } from './store';
  import { startColor, endColor } from './store';


  function handleClick() {
    // Set the buttonClicked store value to true when the button is clicked
    showChartEditor.set(true);
  }

</script>
<div>
  <button style="background-image: linear-gradient(to right, {$startColor}, {$endColor})" on:click={handleClick}>Add Chart</button>
</div>

<style>
  div {
    display: flex;
    justify-content: center;
  }
  button {
    margin-top: 2em;
    border: none;
    /* background-image: linear-gradient(to left, #05acffa0, #dc0999a8); */
    color: white;
  }
    button:hover {
      filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
      color: black;
    }
</style>