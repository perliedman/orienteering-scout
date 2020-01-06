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
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
  import Drawer, {AppContent, Content, Scrim} from '@smui/drawer';
	import { readOcad, ocadToGeoJson, ocadToMapboxGlStyle } from 'ocad2geojson'
	import { reproject, toWgs84 } from 'reproject'
	import MapDb from './map-db'

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
</script>

<style>
	.app-container {
		display: flex;
		flex-flow: column;
		height: 100vh;
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
					on:selectmap={() => { mapGeoJson = null; mapLayers = null; }} />
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
			</Map>
			<CrsSnack crs={crs} on:changecrs={openCrsDialog} />
			<CrsDialog
				crs={crs}
				on:change={setCrs}
				on:cancel={() => { crsDialogOpen = false }}
				open={crsDialogOpen} />
		{/if}
	</div>
</div>
