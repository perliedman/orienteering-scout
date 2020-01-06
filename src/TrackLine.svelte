<script context="module">
  let nextTrackId = 1
</script>

<script>
  import { getContext } from 'svelte'
  import { mapboxgl, key } from './mapbox'

  export let track

  const context = getContext(key)
  const map = context.getMap()

  map.addLayer({
    id: `track-${nextTrackId++}`,
    type: 'line',
    source: {
      type: 'geojson',
      data: track
    },
    paint: {
      'line-color': '#a4a',
      'line-opacity': 0.75,
      'line-width': 10
    }
  })
</script>
