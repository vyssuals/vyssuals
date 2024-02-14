<script lang="ts">
    import { showDataSourceEditor } from "./store";

    function handleClick() {
        showDataSourceEditor.set(true);
    }

</script>


<div>
    <button on:click={handleClick}>Load Csv</button>
</div>


<style>
    div {
      display: flex;
      justify-content: center;
      margin-top: 2em;
    }
</style>
  