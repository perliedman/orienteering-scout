<script>
  import { getContext, createEventDispatcher } from 'svelte'
  import { mapboxgl, key } from './mapbox'
  import AutoRotateControl from './auto-rotate-control'

  const dispatch = createEventDispatcher()
  const context = getContext(key)
  const map = context.getMap()

  const autoRotateControl = new AutoRotateControl()
  autoRotateControl.on('bearing', e => dispatch('bearing', e.bearing))
  autoRotateControl.on('disable', e => dispatch('disable'))
  map.addControl(autoRotateControl)
</script>
