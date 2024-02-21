<script lang="ts">
  import ConnectorList from "./connectors/ConnectorList.svelte";
</script>

<div class="welcome">
  <h1 class="gradient-text">Vyssuals</h1>
  <h2>Real-Time Browser Data Visualisation</h2>
  <p>Connector Plugins:</p>
  <ConnectorList />
</div>

<style>
  .welcome {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20vh;
  }

  h2 {
    font-size: 1.5em;
    font-weight: 300;
    margin: 0.3em;
    text-align: center;
  }

  .gradient-text {
    font-size: 3em;
    font-weight: 500;
    margin: 0.3em;
    background: linear-gradient(to right, #dc0999, #05acff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    font-size: 1em;
    font-weight: 300;
  }
</style>
