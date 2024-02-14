<script lang="ts">
  import RevitConnector from "./RevitConnector.svelte";
  import RhinoConnector from "./RhinoConnector.svelte";
  import { showConnector } from "../store";
  import FloatingWindow from "../FloatingWindow.svelte";

let connector: any;

switch($showConnector) {
  case 'revit':
    connector = RevitConnector;
    break;
  case 'rhino':
    connector = RhinoConnector;
    break;
  default:
    console.error('Invalid connector specified');
}


function hideConnector() {
  showConnector.set('');
}

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideConnector}>
  <div class="connector">
    {#if connector}
      <svelte:component this={connector} />
    {/if}
  </div>
</FloatingWindow>


<style>
    .connector {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        gap: 10px;
        background-color: var(--card-background-color);
        border-radius: 1em;
        padding: 1em;
    }
    
</style>