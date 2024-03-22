<script lang="ts">
    import GradientButton from "./lib/buttons/GradientButton.svelte";
    import { onMount } from "svelte";
    import { colorSyncChartConfig, showChartEditor, showDataConnectionEditor, showDataSourceEditor, showDataInfo } from "./lib/store";
    import ChartGrid from "./lib/charts/ChartGrid.svelte";
    import ChartEditor from "./lib/charts/ChartEditor.svelte";
    import Welcome from "./lib/Welcome.svelte";
    import DataConnectionEditor from "./lib/data/DataConnectionEditor.svelte";
    import DataInfo from "./lib/DataInfo.svelte";
    import OpenDataSourcesButton from "./lib/buttons/OpenDataSourcesButton.svelte";
    import ColorSynchronizer from "./lib/ColorSynchronizer.svelte";
    import { connectWebSocket } from "./lib/websocket/websocket";
    import DataSourceEditor from "./lib/data/DataSourceEditor.svelte";
    import { db } from "./lib/data/databaseManager";

    onMount(() => {
        connectWebSocket();
    });

    function handleAddChart() {
        showChartEditor.set(true);
    }
    
    function handleDataInfo() {
        showDataInfo.set(true);
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

    {#if $showDataInfo}
        <DataInfo />
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
    <a class="info-text bottom-right" href="https://www.yssentyl.com" target="_blank">© Yssentyl 2024</a>
    <span class="bottom-left">
        <button class="info-text" on:click={() => handleDataInfo()}>My Data?</button>
        <a class="info-text" href="https://yssentyl.com/blog/csv-data-visualization-in-under-10-seconds" target="_blank">Tutorial?</a>    
    </span>
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


    .bottom-right {
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 10px;
        padding: 10px;
    }

    .bottom-left {
        position: fixed;
        bottom: 0;
        left: 0;
        margin: 10px;
        padding: 10px;
    }

    .info-text {
        text-decoration: none;
        color: #7d7d7d;
        font-style: italic;
        font-weight: 300;
        font-size: small;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .info-text:hover {
        color: #000;
    }

</style>
