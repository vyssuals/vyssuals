import './app.css'
import App from './App.svelte'
import { createFavicon } from './favicon';
import posthog from 'posthog-js';

createFavicon();
posthog.init('phc_bh1H0R0b76eA4HrhhDDRfbNHfvOQjsIwOdS0NG6aIjp', { api_host: 'https://eu.posthog.com', persistence: 'localStorage' })

const app = new App({
  target: document.getElementById('app'),
})

export default app
