<script>
  import pointOnFeature from '@turf/point-on-feature'

  export let features
  let positions = features.map(f => [f, pointOnFeature(f)])
  // <!-- <a-scene
  //   cursor='rayOrigin: mouse; fuse: true; fuseTimeout: 0;'
  //   raycaster="objects: [gps-entity-place];"
  //   vr-mode-ui="enabled: false"
	// 	embedded
	// 	arjs='sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;'>
  //   <a-camera gps-camera rotation-reader></a-camera>
  //   {#each positions as p}
  //     <a-box color="blue" gps-entity-place={`latitude: ${p[1].geometry.coordinates[1]}; longitude: ${p[1].geometry.coordinates[0]}`} />
  //   {/each}
  // </a-scene> -->
</script>

<div>
  <a-scene
    vr-mode-ui="enabled: false"
    embedded
    arjs='sourceType: webcam;'>

    <a-camera gps-camera rotation-reader>
    </a-camera>
    {#each positions as p}
      <a-image src="marker-icon.png" gps-entity-place={`latitude: ${p[1].geometry.coordinates[1]}; longitude: ${p[1].geometry.coordinates[0]};`}></a-image>
    {/each}
  </a-scene>
</div>

<style>
  div {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }
</style>