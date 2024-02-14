<script lang="ts">

    import FloatingWindow from "./FloatingWindow.svelte";
    import { showDataSourceEditor, dataSources } from "./store";

    function hideDataSourceEditor() {
        showDataSourceEditor.set(false);
    }

    // Define the dummy functions
    function loadFile(path: string) {
        console.log(`Reloading file: ${path}`);
        // Add your file reloading logic here
    }

    function removeItem(path: string) {
        $dataSources = $dataSources.filter(item => item.path !== path);
    }

    function setRefreshInterval(path: string, interval: number) {
        $dataSources = $dataSources.map(item => item.path === path ? { ...item, interval } : item);
    }

    function pickFile(defaultPath: string) {
        console.log('Picking file...');
        // Add your file picking logic here
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideDataSourceEditor}>
    <div class="datasource-editor" id="dataSourceEditor">
        <h1>Data Sources</h1>
        {#if $dataSources.length > 0}
            <table>
                <thead>
                    <tr>
                        <th>Path</th>
                        <th title="Reload Now">Reload</th>
                        <th title="Auto-refresh Interval in Seconds">Interval</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                {#each $dataSources as item (item.path)}
                    <tr>
                    <td class="file-path"><button on:click={() => pickFile(item.path)}>{item.path}</button></td>
                    <td class="symbol"><button on:click={() => loadFile(item.path)}>&#x21BB;</button></td>
                    <td>
                        <input type="number" min="0" bind:value={item.interval} on:input={(e) => setRefreshInterval(item.path, e.target?.value)} />
                    </td>
                    <td class="symbol"><button on:click={() => removeItem(item.path)}>&times;</button></td>
                    </tr>
                {/each}
                </tbody>
            </table>
        {/if}
        <button class="add-file" on:click={() => loadFile('')}>Add CSV File</button>
        <p>Data sources listed here will automatically refresh at the given interval (in seconds).</p>
    </div>
</FloatingWindow>


<style>
    .datasource-editor {
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
     width: 60%;
     text-align: center;
    }

    table {
        margin-bottom: 1em;
    }

    th {
        font-weight: 500;
    }

    .file-path button{
        overflow: hidden; /* Hide overflowed content */
        text-overflow: ellipsis; /* Show ellipsis (...) when the content overflows */
        white-space: nowrap; /* Prevent text from wrapping onto the next line */
        width: 300px;
        background-color: var(--background-color);
        text-align: left;
    }

    .symbol button {
        font-weight: 700;
        /* background: red; */
        background-color: var(--background-color);
        width: 80px;
    }

    td input {
        width: 100px;
        border: none;
        text-align: center;
        padding: 0.95em;
        /* background: red; */
        background-color: var(--background-color);
        border-radius: 8px
    }

    .add-file {
        /* margin-top: 1em; */
        background-color: var(--background-color);
        border: none;
        color: var(--color);
        cursor: pointer;
        width: 174px;
        align-content: left;
    }

</style>