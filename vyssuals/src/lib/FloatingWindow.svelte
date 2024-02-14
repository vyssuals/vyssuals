<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="floating-window" on:click|self>
    <slot></slot>
</div>

<style>

.floating-window {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
}

</style>