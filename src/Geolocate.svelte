<script>
  import { getContext, createEventDispatcher } from 'svelte'
  import { mapboxgl, key } from './mapbox'

  const dispatch = createEventDispatcher()
  const context = getContext(key)
  const map = context.getMap()

  const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  })
  geolocateControl.on('geolocate', e => dispatch('geolocate', [e.coords.longitude, e.coords.latitude]))
  map.addControl(geolocateControl);
</script>