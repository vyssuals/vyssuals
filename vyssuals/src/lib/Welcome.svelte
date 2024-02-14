<script lang="ts">
    import { showConnector } from "./store";
    import Connector from "./connectors/Connector.svelte";

    function handleClickConnector(connector: string) {
        showConnector.set(connector);
    }
</script>
<div class="welcome">

    <h1 class="gradient-text">Vyssuals</h1>
    <h2>Real-Time Browser Data Visualisation</h2>
    <p>Connector Plugins:</p>
    <div>
        <button on:click={() => handleClickConnector('revit')}>Revit</button>
        <button on:click={() => handleClickConnector('rhino')}>Rhino</button>
    </div>

</div>
{#if $showConnector.length > 0}
    <Connector />
{/if}


<style>
    .welcome {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 20vh;
}

    h2 {
        font-size: 1.5em;
        font-weight: 300;
        margin: 0.3em;
    }
    button {
        text-decoration: none;
        /* color: rgb(45, 45, 45); */
        margin: 0.6em;
        background-color: var(--card-background-color);
        /* font-weight: 300; */
    }

    button:hover {
        color: #05ACFF;
    }
    .gradient-text {
        font-size: 3em;
        font-weight: 500;
        margin: 0.3em;
        background: linear-gradient(to right, #DC0999, #05ACFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    p {
        font-size: 1em;
        font-weight: 300;
    }
</style>
