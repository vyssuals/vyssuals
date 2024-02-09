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
    background-image: linear-gradient(to right, #05acffa0, #dc0999a8);
    color: white;
    /* -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */
  }
    button:hover {
      filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
    }
</style>