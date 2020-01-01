<script>
  export let mode
  export let name
</script>

<div class:active={mode == name}>
  <slot />  
</div>

<style>
  div {
    display: none;
  }

  div.active {
    display: block;
  }
</style>