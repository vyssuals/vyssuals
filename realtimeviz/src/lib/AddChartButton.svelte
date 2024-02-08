<script>
  import { showChartEditor } from '../store';

  function handleClick() {
    // Set the buttonClicked store value to true when the button is clicked
    showChartEditor.set(true);
  }

</script>

<button on:click={handleClick}>Add Chart</button>

<style>
  button {
    margin-top: 2em;
    border: none;
  }
    button:hover {
    filter: drop-shadow(0 0 0.5em #05305548);
  }
</style>