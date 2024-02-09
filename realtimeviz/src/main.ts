import './app.css'
import App from './App.svelte'
import { createFavicon } from './favicon';

createFavicon();

const app = new App({
  target: document.getElementById('app'),
})

export default app
