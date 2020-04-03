class Route {
  constructor(url, routeTo) {
    this.matcher = url
    this.destination = routeTo
  }
  dispatch() {
    let [controllerName, action] = this.destination.split("#")
    controllerName = `${controllerName}Controller`
    eval(`new ${controllerName}().${action}({match:this._lastMatch})`)
    this._lastMatch = null
  }
  // TODO: more complex matchers
  match(location) {
    // regex matchers
    if (typeof this.matcher === "object") {
      let match = location.pathname.match(this.matcher)
      if (match) {
        this._lastMatch = match
        return true
      }
    } else {
      return location.pathname === this.matcher
    }
  }
}

export class Router {
  constructor() {
    this.table = []
  }
  go(location) {
    let route = this.table.find((route) => route.match(location))
    if (route)
      route.dispatch()
  }
  get(url, routeTo) {
    this.table.push(new Route(url, routeTo))
  }

}