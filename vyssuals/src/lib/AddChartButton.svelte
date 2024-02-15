<script>
  import { showChartEditor } from './store';
  import { startColor, endColor } from './store';

</script>


<div>
  <button style="background-image: linear-gradient(to right, {$startColor}, {$endColor})" on:click>Add Chart</button>
</div>


<style>
  div {
    display: flex;
    justify-content: center;
  }

  button {
    margin-top: 2em;
    border: none;
    color: white;
  }
  button:hover {
    color: black;
  }
</style>