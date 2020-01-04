export default class MapDb {
  get (name) {
    try {
      const json = window.localStorage.getItem(this.getKey(name))
      return json && JSON.parse(json)
    } catch (e) {
      console.warn(`Error getting data for ${this.getKey(name)}`, e)
      return null
    }
  }

  set (name, data) {
    window.localStorage.setItem(this.getKey(name), JSON.stringify(data))    
  }

  getKey (name) {
    return `os/maps/${name}`
  }
}
