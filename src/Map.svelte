<script>
  import LinearProgress from '@smui/linear-progress';
	import { onMount, afterUpdate, setContext } from 'svelte'
  import { mapboxgl, key as contextKey } from './mapbox'
  import bbox from '@turf/bbox'

  mapboxgl.accessToken = '__mapboxGlToken__'

  export let geojson
  export let layers

  let mapContainer
  let map
  let currentGeojson
  let snackbar
  let mapLoaded
  let userCoord
  let userBearing
  let style = {
    version: 8,
    name: 'OCAD demo',
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    sources: {
      map: {
        type: 'geojson',
        data: geojson
      }
    },
    layers
  }
  let bounds = bbox(geojson)

  setContext(contextKey, {
    getMap: () => map
  })

  onMount(() => {
    currentGeojson = geojson

    map = new mapboxgl.Map({
      container: mapContainer,
      style,
      center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
      zoom: 14
    })

    map.addControl(new mapboxgl.NavigationControl({showZoom: false}))

    map.on('load', () => {
      mapLoaded = true
      map.fitBounds(bounds)
    })
  })

  afterUpdate(() => {
    if (map && currentGeojson !== geojson) {
      map.getSource('map').setData(geojson)
      currentGeojson = geojson
      map.fitBounds(bbox(geojson))
    }
  })

</script>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>

<div class="map-container" bind:this={mapContainer}>
  {#if map}
    <slot></slot>
  {/if}
</div>
{#if !mapLoaded}
  <LinearProgress indeterminate />
{/if}
