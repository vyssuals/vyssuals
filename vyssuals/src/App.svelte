<script lang="ts">
    import GradientButton from "./lib/buttons/GradientButton.svelte";
    import { onMount } from "svelte";
    import { colorSyncChartConfig, showChartEditor, showDataConnectionEditor, showDataSourceEditor } from "./lib/store";
    import ChartGrid from "./lib/charts/ChartGrid.svelte";
    import ChartEditor from "./lib/charts/ChartEditor.svelte";
    import Welcome from "./lib/Welcome.svelte";
    import DataConnectionEditor from "./lib/data/DataConnectionEditor.svelte";
    import OpenDataSourcesButton from "./lib/buttons/OpenDataSourcesButton.svelte";
    import ColorSynchronizer from "./lib/ColorSynchronizer.svelte";
    import { connectWebSocket } from "./lib/data/websocket";
    import DataSourceEditor from "./lib/data/DataSourceEditor.svelte";
    import { db } from "./lib/data/databaseManager";

    onMount(() => {
        connectWebSocket();
    });

    function handleAddChart() {
        showChartEditor.set(true);
    }

    $: hasChartConfigs = db.vyssuals.hasChartConfigs;
    $: hasDatabases = db.hasDatabases;
</script>

<main>
    {#if $hasChartConfigs}
        <ChartGrid />
    {:else}
        <Welcome />
    {/if}

    {#if $showChartEditor}
        <ChartEditor />
    {/if}

    {#if $showDataConnectionEditor}
        <DataConnectionEditor />
    {/if}

    {#if $showDataSourceEditor}
        <DataSourceEditor />
    {/if}

    {#if $hasDatabases}
        <div style="padding-top: 2em; padding-bottom: 1em;">
            <GradientButton on:click={handleAddChart} />
        </div>
    {:else}
        <div style="display: flex; justify-content: center; padding-top: 1em; font-weight: 300;">
            <p>Load CSV File:</p>
        </div>
    {/if}

    <OpenDataSourcesButton />
    {#if $colorSyncChartConfig}
        <ColorSynchronizer />
    {/if}
</main>

<footer>
    <a href="https://www.yssentyl.com">© Yssentyl 2024</a>
</footer>

<style>
    main {
        padding: 2rem;
    }

    footer {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 40px;
    }

    a {
        text-decoration: none;
        color: #7d7d7d;
        font-style: italic;
        font-weight: 300;
    }

    a:hover {
        color: #05acff;
    }
</style>
