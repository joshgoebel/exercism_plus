class Route {
  constructor(url, routeTo) {
    this.matcher = url
    this.destination = routeTo
    this.compile()
  }
  compile() {
    let [controllerName, action] = this.destination.split("#")
    controllerName = `${controllerName}Controller`
    this.actionName = action
    this.newController = new Function(`return new ${controllerName}()`);
  }
  dispatch() {
    this.newController()[this.actionName]({match:this._lastMatch});
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
  static get app() {
    return new Proxy(() => {}, {
      apply: function(obj) {
        return `${obj.controller}#${obj.action}`
      },
      get: function(obj, prop,receiver) {
        if (prop[0] === prop[0].toUpperCase()) {
          obj.controller = `${prop}`
        } else {
          obj.action = prop
          // return `${obj.controller}#${obj.action}`
        }
        // console.log(`${obj.controller}#${obj.action}`)
        // console.log(receiver)
        return receiver
      }
    } )
  }
}