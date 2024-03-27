<script lang="ts">
export let left = 0;
export let top = 0;
	
	let moving = false;
	
	function onMouseDown() {
		moving = true;
	}
	
	function onMouseMove(e: { movementX: number; movementY: number; }) {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
		}
	}
	
	function onMouseUp() {
		moving = false;
	}
	
</script>

<style>
	.draggable {
		user-select: none;
		/* cursor: pointer; */
		/* border: solid 1px gray; */
		position: absolute;
	}
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<section on:mousedown={onMouseDown} style="left: {left}px; top: {top}px;" class="draggable">
	<slot></slot>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />