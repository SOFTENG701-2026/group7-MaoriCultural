import { mount } from 'svelte'
import './app.css'
import './accessibility.css'
import App from './App.svelte'
import { settings } from './lib/settings.svelte'

// Apply saved accessibility choices before the first paint so there is no flash
// of un-styled content. App.svelte keeps these in sync afterwards.
const root = document.documentElement
root.classList.toggle('hc', settings.highContrast)
root.classList.toggle('big-text', settings.textSize === 'large')

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
