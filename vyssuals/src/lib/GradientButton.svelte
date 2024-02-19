<script>
  import { showChartEditor } from './store';
  import { startColor, endColor } from './store';

  export let buttonText = 'Add Chart';

</script>


<div>
  <button style="background-image: linear-gradient(to right, {$startColor}, {$endColor})" on:click>{buttonText}</button>
</div>


<style>
  div {
    display: flex;
    justify-content: center;
  }

  button {
    margin-top: 2em;
    margin-left: 1em;
    margin-right: 1em;
    border: none;
    color: white;
  }
  button:hover {
    color: black;
  }
</style>