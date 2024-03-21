<script lang="ts">
    import FloatingWindow from "../wrapper/FloatingWindow.svelte";
    import { showDataConnectionEditor, showDataSourceEditor, dataSourceToEdit } from "../store";
    import { UNIT_SYMBOLS, COLUMN_TYPES, type DataSource, type Header } from "../types";
    import { db } from "./databaseManager";

    function hideDataSourceEditor() {
        showDataSourceEditor.set(false);
        showDataConnectionEditor.set(true);
    }

    $: metadata = db.get($dataSourceToEdit).metadata.toCollection().toArray();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideDataSourceEditor}>
    <div class="datasource-editor">
        <button title="Close" class="close-button" on:click={() => hideDataSourceEditor()}>&times;</button>
        <h1>Datasource Editor</h1>
        <p>{$dataSourceToEdit}</p>
        <div class="grid-container">
            {#await metadata then metadata}
                {#each metadata as header (header)}
                    <div class="grid-item">
                        <h2>{header.name}</h2>
                        <div class="config-option">
                            <label for="dataTypes">Data Type:</label>
                            <select
                                class="config-select"
                                id="dataTypes"
                                bind:value={header.type}
                                on:change={() => {
                                    if (header.type === "string") {
                                        header.unitSymbol = "# Unique Items";
                                    }
                                    db.get($dataSourceToEdit).updateHeader(header);
                                }}
                            >
                                {#each COLUMN_TYPES as type}
                                    <option value={type}>{type}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="config-option">
                            <label for="unitSymbol">Unit Symbol:</label>
                            <select
                                class="config-select"
                                id="unitSymbol"
                                bind:value={header.unitSymbol}
                                on:change={() => db.get($dataSourceToEdit).updateHeader(header)}
                                disabled={header.type !== "number"}
                            >
                                {#each UNIT_SYMBOLS as symbol}
                                    <option value={symbol}>{symbol}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                {/each}
            {/await}
        </div>
        <p>
            The 'Type' affects calculations.<br />
            The values of 'Number' parameters will be aggregated, while 'String' (Text) parameters will show the count of unique items.<br
            />
            'UnitSymbol' does not affect calculations.
        </p>
    </div>
</FloatingWindow>

<style>
    .grid-container {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
        justify-content: center;
        margin-top: 1em;
        overflow: auto; /* Add a scrollbar if necessary */
        max-height: 80%; /* Set a maximum height */
    }

    .grid-item {
        text-align: center;
        position: relative;
        background-color: var(--background-color);
        padding: 5px;
        border-radius: 1em;
        height: 130px;
        width: 250px;
    }

    .datasource-editor {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--card-background-color);
        padding: 2em;
        border-radius: 1em;
        width: 80%;
        max-height: 80%;
    }

    h2 {
        margin: 0;
        overflow: hidden; /* Hide overflowed content */
        text-overflow: ellipsis; /* Show ellipsis (...) when the content overflows */
        white-space: nowrap; /* Prevent text from wrapping onto the next line */
        text-align: center;
        padding: 0.1em 0.5em 0 0.1em;
        font-weight: 500;
        padding-top: 10px;
        padding-bottom: 5px;
    }

    p {
        text-align: center;
        font-weight: 300;
    }

    .close-button {
        font-weight: 700;
        font-size: large;
        background-color: #00000000;
        border: none;
        cursor: pointer;

        position: absolute;
        top: 0.3em;
        right: 0.3em;
    }

    .close-button:hover {
        filter: drop-shadow(0 0 8px #000000);
    }

    /* This applies to the scrollbar in the .grid-container */
    .grid-container::-webkit-scrollbar {
        width: 10px; /* width of the entire scrollbar */
    }

    .grid-container::-webkit-scrollbar-track {
        background: var(--card-background-color); /* color of the tracking area */
    }

    .grid-container::-webkit-scrollbar-thumb {
        background: var(--background-color); /* color of the scroll thumb */
        border-radius: 10px; /* roundness of the scroll thumb */
    }

    /* Add a hover effect to the scroll thumb */
    .grid-container::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
