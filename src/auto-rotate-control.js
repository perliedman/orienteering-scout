import { Event, Evented } from 'mapbox-gl/src/util/evented'

export default class AutoRotateControl extends Evented {
  onAdd (map) {
    if (window.DeviceOrientationEvent) {
      this._map = map
      this._container = document.createElement('div')
      this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'

      const btn = document.createElement('button')
      btn.className = 'mapboxgl-ctrl-icon material-icons'
      btn.textContent = 'rotate_right'
      this._container.appendChild(btn)

      let active = false
      const listener = this.onDeviceOrientation.bind(this)

      btn.addEventListener('click', () => {
        active = !active

        if (active) {      
          btn.classList.add('autorotate-control-active')
          window.addEventListener('deviceorientation', listener)
        } else {
          btn.classList.remove('autorotate-control-active')
          window.removeEventListener('deviceorientation', listener)
        }
      })

      return this._container
    } else {
      return null
    }
  }

  onRemove () {
    this._container.parentNode.removeChild(this._container)
    this._map = undefined
  }

  onDeviceOrientation (event) {
    let alpha;

    if(event.webkitCompassHeading) {
      alpha = event.webkitCompassHeading;
    } else {
      alpha = event.alpha;
      if (!window.chrome) {
        // Assume Android stock
        alpha -= 270;
      }
    }

    const bearing = 180 - alpha

    this._map.setBearing(bearing)
    this.fire(new Event('bearing', { bearing }))
  }
}
