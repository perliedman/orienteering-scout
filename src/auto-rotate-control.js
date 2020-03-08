import EventEmitter from 'events'

export default class AutoRotateControl {
  constructor () {
    this._eventEmitter = new EventEmitter()
  }

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
          window.addEventListener('deviceorientationabsolute', listener)
          window.addEventListener('deviceorientation', listener)
          this._eventEmitter.emit('enable')
        } else {
          btn.classList.remove('autorotate-control-active')
          window.removeEventListener('deviceorientationabsolute', listener)
          window.removeEventListener('deviceorientation', listener)
          this._eventEmitter.emit('disable')
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

  on (type, handler) {
    this._eventEmitter.addListener(type, handler)
  }

  off (type, handler) {
    this._eventEmitter.removeListener(type, handler)
  }

  onDeviceOrientation (event) {
    if (!event.absolute) return
    const bearing = event.alpha
    this._map.setBearing(bearing)
    this._eventEmitter.emit('bearing', { bearing, originalEvent: event })
  }
}
