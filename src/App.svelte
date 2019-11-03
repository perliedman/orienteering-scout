<script>
	import MapChooser from './MapChooser.svelte'
	import Map from './Map.svelte'
	import { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } from 'ocad2geojson'
	import { toWgs84 } from 'reproject'

	let mapGeoJson
	let mapLayers

	function loadMap(map) {
		const projDef = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'

		readOcad(map.content)
		.then(ocadFile => {
			mapGeoJson = toWgs84(ocadToGeoJson(ocadFile), projDef)
			mapLayers = ocadToMapboxGlStyle(ocadFile, {source: 'map', sourceLayer: ''})
		})
	}
</script>

<style>
</style>

{#if (!mapGeoJson || !mapLayers)}
<MapChooser on:mapselected={e => loadMap(e.detail)} />
{:else}
<Map geojson={mapGeoJson} layers={mapLayers} />
{/if}
