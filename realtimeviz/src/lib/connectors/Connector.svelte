<script lang="ts">
  import RevitConnector from "./RevitConnector.svelte";
  import RhinoConnector from "./RhinoConnector.svelte";
  import { showConnector } from "../store";

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

</script>

<div class="connector-overlay">
{#if connector}
  <svelte:component this={connector} />
{/if}
<h1>Test</h1>
</div>

<style>
    .connector-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
    }
  
</style>