<script>
	import Menu from './Menu.svelte'
	import { Header, Subtitle } from '@smui/drawer'
	import MapChooser from './MapChooser.svelte'
	import CrsSnack from './CrsSnack.svelte'
	import CrsDialog from './CrsDialog.svelte'
	import Map from './Map.svelte'
	import Highlight from './Highlight.svelte'
	import Geolocate from './Geolocate.svelte'
	import AutoRotate from './AutoRotate.svelte'
	import TrackLine from './TrackLine.svelte'
	import DistanceWarning from './DistanceWarning.svelte'
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
  import Drawer, {AppContent, Content, Scrim} from '@smui/drawer';
	import { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } from 'ocad2geojson'
	import { reproject, toWgs84 } from 'reproject'
	import MapDb from './map-db'
	import togeojson from '@mapbox/togeojson'

	const mapDb = new MapDb()

	let mapInfo
	let mapGeoJson
	let mapLayers
	let drawer
	let drawerOpen = false
	let crsDialogOpen = false
	let crs = {
		epsg: 3006,
		proj: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs '
	}
	let userCoord
	let userBearing
	let trackFileInput
	let tracks = []

	function loadMap(map) {
		mapInfo = {
			name: map.name
		}

		readOcad(map.content)
		.then(ocadFile => {
			const mapMeta = mapDb.get(map.name)
			if (mapMeta) {
				crs = mapMeta.crs
			}

			mapGeoJson = toWgs84(ocadToGeoJson(ocadFile), crs.proj)
			mapLayers = ocadToMapboxGlStyle(ocadFile, {source: 'map', sourceLayer: ''})
		})
	}

	function openCrsDialog () {
		crsDialogOpen = true
	}

	function setCrs ({ detail: { epsg } }) {
		crsDialogOpen = false
		window.fetch(`https://epsg.io/${epsg}.proj4`)
		.then(response => response.text())
		.then(proj => {
			const projected = reproject(mapGeoJson, 'EPSG:4326', crs.proj)
			mapGeoJson = toWgs84(projected, proj)
			crs = { epsg, proj }
			mapDb.set(mapInfo.name, { crs })
		})
		.catch(err => console.error(err))
	}

	function loadTrack () {
    const file = event.target.files[0]
		const reader = new FileReader()
		reader.onload = () => {
			const dom = new DOMParser().parseFromString(reader.result, 'text/xml')
			tracks = [...tracks, togeojson.gpx(dom)]
		}
		reader.onerror = err => console.error(err)
		reader.readAsText(file)
	}
</script>

<style>
	.app-container {
		display: flex;
		flex-flow: column;
		height: 100%;
	}

	.main-content {
		flex: 1;
	}
</style>

<div class="app-container">
	<div>
		<TopAppBar variant="static" dense color="primary">
			<Row>
				<Section>
					<IconButton class="material-icons" on:click={() => drawerOpen = !drawerOpen}>menu</IconButton>
					<Title>{mapInfo && mapInfo.name || 'Orienteering Scout'}</Title>
				</Section>
			</Row>
		</TopAppBar>
		<Drawer variant="modal" bind:this={drawer} bind:open={drawerOpen}>
			<Header>
				<Title>Orienteering Scout</Title>
				{#if mapInfo}
					<Subtitle>{mapInfo.name}</Subtitle>
				{/if}
			</Header>
			<Content>
				<Menu
					crs={crs}
					on:close={() => drawerOpen = false}
					on:selectcrs={openCrsDialog}
					on:selectmap={() => { mapGeoJson = null; mapLayers = null; }}
					on:selecttrack={() => { trackFileInput.click() }} />
			</Content>
		</Drawer>
		<Scrim />
	</div>
	<div class="main-content">
		{#if (!mapGeoJson || !mapLayers)}
			<MapChooser on:mapselected={e => loadMap(e.detail)} />
		{:else}
			<Map geojson={mapGeoJson} layers={mapLayers}>
				<Geolocate on:geolocate={e => { userCoord = e.detail }} />
				<AutoRotate on:bearing={e => { userBearing = e.detail }} on:disable={() => { userBearing = undefined }} />
				<Highlight userCoord={userCoord} userBearing={userBearing}></Highlight>
				{#each tracks as t}
					<TrackLine track={t} />
				{/each}
			</Map>
			<CrsSnack crs={crs} on:changecrs={openCrsDialog} />
			<CrsDialog
				crs={crs}
				on:change={setCrs}
				on:cancel={() => { crsDialogOpen = false }}
				open={crsDialogOpen} />
			<DistanceWarning mapGeoJson={mapGeoJson} userCoord={userCoord} on:selectcrs={openCrsDialog} />
		{/if}
	</div>
</div>

<input
	type="file"
	accept=".gpx"
	on:change={loadTrack}
	bind:this={trackFileInput}
	style="display: none;" />
