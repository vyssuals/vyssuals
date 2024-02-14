<script lang="ts">
    import { showDataSourceEditor } from "./store";

    function handleClick() {
        showDataSourceEditor.set(true);
    }

</script>


<div>
    <button title="Data Sources" on:click={handleClick}>&#9776;</button>
</div>


<style>
    div {
        display: flex;
        justify-content: center;
        margin-top: 1em;
    }

    button {
        font-weight: 700;
        font-size: large;
        background-color: #00000000;
        border: none;
        cursor: pointer;
        transition: transform 0.3s;
    }

    button:hover {
        transform: scale(1.7);
        filter: drop-shadow(0 0 8px #000000);
    }


</style>
  