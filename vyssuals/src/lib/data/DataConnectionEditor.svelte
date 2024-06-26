<script lang="ts">
    import FloatingWindow from "../wrapper/FloatingWindow.svelte";
    import { showDataConnectionEditor, showChartEditor, startColor, endColor, showDataSourceEditor, dataSourceToEdit } from "../store";
    import type { ChartConfig, Header } from "../types";
    import GradientButton from "../buttons/GradientButton.svelte";
    import ConnectorList from "../connectors/ConnectorList.svelte";
    import { autoChart } from "../chartSetup/AutoCharts";
    import { db } from "./databaseManager";
    import { blur } from "svelte/transition";
    import { loadCSVFile } from "../utils/csvUtils";
    import posthog from "posthog-js";

    let files: FileList | null = null;
    let wsDataSourcesPromise: Promise<string[]> = Promise.resolve([]);
    let fileDataSourcesPromise: Promise<string[]> = Promise.resolve([]);

    $: wsDataSourcesPromise = getDataSources("websocket");
    $: fileDataSourcesPromise = getDataSources("file");
    $: allDataSourcesPromise = Promise.all([wsDataSourcesPromise, fileDataSourcesPromise]);
    $: hasDatabases = db.hasDatabases;

    async function getDataSources(type: string): Promise<string[]> {
        return new Promise(async (resolve) => {
            const promises = Array.from(db.databases.values()).map((db) => db.type.then((dbType) => (dbType === type ? db.name : null)));
            const names = (await Promise.all(promises)).filter(Boolean) as string[];
            resolve(names);
        });
    }

    async function handleFileSelection(e: Event) {
        if (e.target instanceof HTMLInputElement) {
            files = e.target.files;
            if (files) {
                let file = files[0];
                if (file) {
                    const name = file.name;
                    if (db.dataSourceNames.some((item) => item === name)) {
                        alert(`File is already a data source: ${name}`);
                    } else {
                        let dataPayload = await loadCSVFile(file);
                        db.get(name).push("file", dataPayload);
                    }
                    fileDataSourcesPromise = getDataSources("file");
                    files = null;
                }
            }
        }
    }

    function hideDataConnectionEditor() {
        showDataConnectionEditor.set(false);
    }

    function handleAddChart() {
        hideDataConnectionEditor();
        showChartEditor.set(true);
    }

    async function handleAutoChart(dataSourceName: string) {
        const ds = db.get(dataSourceName);
        ds.addAnalyticsToHeaders().then(() => {
            try {
                ds.metadata
                    .toCollection()
                    .toArray()
                    .then((headers: Header[]) => {
                        if (headers.length === 0) {
                            alert("No data found in the data source. Please add data to the data source before creating charts.");
                            return;
                        }

                        const autoChartConfigs: ChartConfig[] = autoChart(dataSourceName, headers, 5, $startColor, $endColor);
                        db.vyssuals.addChartConfigs(autoChartConfigs);
                        posthog.capture("auto_chart_created");
                    });
            } catch (error: any) {
                console.error("Error generating auto chart:", error);
                posthog.capture("auto_chart_error", { error: error.message });
            }
        });
    }

    async function handleReloadCSVFile(dataSourceName: string, e: Event) {
        // check if file is the same as the one already loaded
        if (e.target instanceof HTMLInputElement && e.target.files && e.target.files.length > 0) {
            const file: File = e.target.files[0];
            if (dataSourceName == file.name) {
                let dataPayload = await loadCSVFile(file);
                db.get(dataSourceName).push("file", dataPayload);
                return;
            } else {
                alert("Ooops, clicked on the wrong file? Please select the same file to reload it.");
            }
        }
        posthog.capture("csv_file_reloaded");
    }

    function handleEditButton(name: string) {
        dataSourceToEdit.set(name);
        showDataConnectionEditor.set(false);
        showDataSourceEditor.set(true);
        posthog.capture("data_source_edit");
    }

    function handleRemoveItem(dataSourceName: string) {
        if (confirm(`Are you sure you want to remove the data source: ${dataSourceName}`)) {
            db.deleteDatabase(dataSourceName);
            fileDataSourcesPromise = getDataSources("file");
            wsDataSourcesPromise = getDataSources("websocket");
        }
        posthog.capture("data_source_removed");
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideDataConnectionEditor}>
    <div class="dataconnection-editor" transition:blur={{ duration: 100 }}>
        <button title="Close" class="close-button" on:click={() => hideDataConnectionEditor()}>&times;</button>
        <h1>Real-Time Connections</h1>
        {#await wsDataSourcesPromise then wsDataSources}
            {#if wsDataSources.length > 0}
                <div style="padding-bottom: 1em;">
                    <table>
                        <thead>
                            <tr>
                                <th>Auto Create</th>
                                <th>Path</th>
                                <th>Settings</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each wsDataSources as item (item)}
                                <tr>
                                    <td
                                        ><GradientButton
                                            on:click={() => {
                                                handleAutoChart(item);
                                            }}
                                            buttonText="Add Charts"
                                        /></td
                                    >
                                    <td><p class="file-path">{item}</p></td>
                                    <td class="symbol"
                                        ><button style="font-size: 25px; padding: 0.15em" on:click={() => handleEditButton(item)}
                                            >&#9881;</button
                                        ></td
                                    >
                                    <td class="symbol"><button on:click={() => handleRemoveItem(item)}>&times;</button></td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <p>
                    No Real-Time Connection Active.<br />
                    Start the Vyssuals plugin in your desktop application or install a connector plugin:
                </p>
                <div style="padding: 1em;">
                    <ConnectorList />
                </div>
            {/if}
        {:catch error}
            <p>Error: {error.message}</p>
        {/await}

        <h1>CSV Connections</h1>
        {#await fileDataSourcesPromise then fileDataSources}
            {#if fileDataSources.length > 0}
                <table>
                    <thead>
                        <tr>
                            <th>Auto Create</th>
                            <th>Path</th>
                            <th>Settings</th>
                            <th>Reload</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each fileDataSources as item (item)}
                            <tr>
                                <td
                                    ><GradientButton
                                        on:click={() => {
                                            handleAutoChart(item);
                                        }}
                                        buttonText="Add Charts"
                                    /></td
                                >
                                <td><p class="file-path">{item}</p></td>
                                <td class="symbol"
                                    ><button style="font-size: 25px; padding: 0.15em" on:click={() => handleEditButton(item)}
                                        >&#9881;</button
                                    ></td
                                >
                                <td class="symbol"
                                    ><input
                                        type="file"
                                        id="filePicker"
                                        accept=".csv"
                                        on:change={(e) => handleReloadCSVFile(item, e)}
                                        style="display: none"
                                    />
                                    <button
                                        on:click={() => {
                                            if (
                                                confirm(
                                                    `Due to browser security restrictions, please select the same file again to reload it: ${item}`
                                                )
                                            ) {
                                                const filePicker = document.getElementById("filePicker");
                                                if (filePicker) {
                                                    filePicker.click();
                                                }
                                            }
                                        }}>&#x21BB;</button
                                    ></td
                                >
                                <td class="symbol"><button on:click={() => handleRemoveItem(item)}>&times;</button></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        {:catch error}
            <p>Error: {error.message}</p>
        {/await}
        <div>
            <label for="filePicker">Add CSV:</label>
            <input type="file" id="filePicker" accept=".csv" on:change={handleFileSelection} />
        </div>

        {#if $hasDatabases}
            <div style="padding-top: 1em;">
                <GradientButton on:click={handleAddChart} />
            </div>
        {/if}
    </div>
</FloatingWindow>

<style>
    .dataconnection-editor {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--card-background-color);
        padding: 2em;
        border-radius: 1em;
    }

    h1 {
        margin-bottom: 1em;
    }

    p {
        font-weight: 300;
        margin: 0;
        text-align: center;
    }

    th {
        font-weight: 500;
    }

    .file-path {
        overflow: hidden; /* Hide overflowed content */
        text-overflow: ellipsis; /* Show ellipsis (...) when the content overflows */
        white-space: nowrap; /* Prevent text from wrapping onto the next line */
        width: 300px;
        font-weight: 300;
        text-align: center;
        border-radius: 8px;
        border: 3px solid var(--background-color);
        padding: 0.4em 1.2em;
        margin: 0;
    }

    input[type="file"] {
        background: var(--background-color);
        border-radius: 8px;
        width: 200px;
        padding: 10px;
        cursor: pointer;
    }

    input[type="file"]::file-selector-button {
        display: none;
        /* border: none; */
    }

    input[type="file"]:hover {
        filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
    }

    .symbol button {
        font-weight: 700;
        background-color: var(--background-color);
        width: 80px;
        font-size: 20px;
        padding: 0.3em;
    }

    td input {
        width: 100px;
        border: none;
        text-align: center;
        padding: 0.6em 1.2em;
        font-size: 1em;
        background-color: var(--background-color);
        border-radius: 8px;
    }

    td p {
        background-color: var(--card-background-color);
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
</style>
