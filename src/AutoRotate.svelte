<script>
  import { getContext, createEventDispatcher } from 'svelte'
  import { readable } from 'svelte/store'
  import { mapboxgl, key } from './mapbox'
  import AutoRotateControl from './auto-rotate-control'

  const dispatch = createEventDispatcher()
  const context = getContext(key)
  const map = context.getMap()

  let enabled = false

  function enable () {
    enabled = true
    dispatch('enable')
  }

  function disable () {
    enabled = false
    dispatch('disable')
  }

  function update (e) {
    dispatch('bearing', e.bearing)
  }

  const autoRotateControl = new AutoRotateControl()
  autoRotateControl.on('bearing', update)
  autoRotateControl.on('enable', enable)
  autoRotateControl.on('disable', disable)
  map.addControl(autoRotateControl)

  const lastEvent = readable(null, function (set) {
    autoRotateControl.on('bearing', event => set(event))
  })
</script>

{#if enabled && $lastEvent}
<div>
  <pre>{JSON.stringify($lastEvent, null, 2)}</pre>
</div>
{/if}

<style>
  div {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }
</style>