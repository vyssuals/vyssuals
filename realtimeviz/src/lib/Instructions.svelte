<script lang="ts">
    import { showConnector } from "./store";

    function handleClickConnector(connector: string) {
        showConnector.set(connector);
    }
</script>

<h1 class="gradient-text">Vyssuals</h1>
<h2>Data Visualisation for Desktop Applications</h2>
<p>Download and Install Live Connector:</p>
<div>
    <button on:click={() => handleClickConnector('revit')}>Revit</button>
    <button on:click={() => handleClickConnector('rhino')}>Rhino</button>
</div>


<style>
    h2 {
        font-size: 1.5em;
        font-weight: 300;
        margin: 0.3em;
    }
    button {
        text-decoration: none;
        color: rgb(45, 45, 45);
        margin: 0.6em;
        font-weight: 300;
    }

    button:hover {
        color: #05ACFF;
        filter: drop-shadow(0 0 0.5em var(--dropshadow-color))
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
