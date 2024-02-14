<script lang="ts">
    import Draggable from "./Draggable.svelte";
    import FloatingWindow from "./FloatingWindow.svelte";
    import { showDataSourceEditor } from "./store";

    function hideDataSourceEditor() {
        showDataSourceEditor.set(false);
    }

    const left = (window.innerWidth / 2) - 135;
    const top = (window.innerHeight / 2) - 250;

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideDataSourceEditor}>
    <Draggable {left} {top}>
        <div class="datasource-editor">
            <h1>DataSource Editor</h1>
            <p>Coming soon...</p>
        </div>
    </Draggable>
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
</style>