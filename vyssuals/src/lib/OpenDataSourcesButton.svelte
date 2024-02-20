<script lang="ts">
    import { showDataConnectionEditor } from "./store";

    function handleClick() {
        showDataConnectionEditor.set(true);
    }

</script>


<div>
    <button title="Data Sources" on:click={handleClick}>&#9776;</button>
</div>


<style>
    div {
        display: flex;
        justify-content: center;
    }

    button {
        font-weight: 700;
        font-size: 2em;
        background-color: #00000000;
        border: none;
        cursor: pointer;
        transition: transform 0.3s;
        margin: 0;
        padding: 0;
    }

    button:hover {
        transform: scale(1.7);
        filter: drop-shadow(0 0 8px #000000);
    }


</style>
  