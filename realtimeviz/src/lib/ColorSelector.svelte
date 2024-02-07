<script lang="ts">
    import { startColor, endColor } from "../store";

</script>

<div>
    <h2>Color Selector</h2>

    <label for="startColor">Start Color:</label>
    <input type="color" id="startColor" bind:value={$startColor} />

    <label for="endColor">End Color:</label>
    <input type="color" id="endColor" bind:value={$endColor} />
</div>