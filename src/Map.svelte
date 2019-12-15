<script>
	import { onMount } from 'svelte'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import bbox from '@turf/bbox'

  mapboxgl.accessToken = '__mapboxGlToken__'

  export let geojson
  export let layers

  let mapContainer
  let map
  let mapLoaded
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

  onMount(() => {
    map = new mapboxgl.Map({
      container: mapContainer,
      style,
      center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
      zoom: 14
    })
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    map.on('load', () => {
      mapLoaded = true
      map.fitBounds(bounds)
    })
  })

</script>

<style>
  div {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={mapContainer}></div>
{#if !mapLoaded}
<div class="loading">Please wait, loading map...</div>
{/if}
