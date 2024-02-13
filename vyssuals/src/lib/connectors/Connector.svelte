<script lang="ts">
  import RevitConnector from "./RevitConnector.svelte";
  import RhinoConnector from "./RhinoConnector.svelte";
  import { showConnector } from "../store";
  import { onMount } from 'svelte';

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


function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.connector')) {
      showConnector.set('');

    }
  }

  onMount(() => {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100); // Add a delay of 100 milliseconds
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

</script>

<div class="connector-overlay">
  <div class="connector">

{#if connector}
  <svelte:component this={connector} />
{/if}
</div>
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