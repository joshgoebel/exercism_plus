class Route {
  constructor(url, routeTo) {
    this.matcher = url
    this.destination = routeTo
  }
  dispatch() {
    let [controllerName, action] = this.destination.split("#")
    controllerName = `${controllerName}Controller`
    eval(`new ${controllerName}().${action}()`)
  }
  match(location) {
    // TODO: more complex matchers
    return location.pathname === this.matcher
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