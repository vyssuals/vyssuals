<script lang="ts">
  import { showConnector } from "../store";
  import Connector from "./Connector.svelte";

  function handleClickConnector(connector: string) {
    showConnector.set(connector);
  }
</script>

<div>
  <button on:click={() => handleClickConnector("revit")}>Revit</button>
  <!-- <button on:click={() => handleClickConnector("rhino")}>Rhino</button> -->
</div>

{#if $showConnector.length > 0}
  <Connector />
{/if}

<style>
  button {
    text-decoration: none;
    /* margin: 0.6em; */
    background-color: var(--card-background-color);
  }

  button:hover {
    color: #05acff;
  }
</style>
