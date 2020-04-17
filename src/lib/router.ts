
type URLMatcher = string | RegExp

class Route {
  private matcher: URLMatcher
  private destination: string
  private actionName: string = ""
  private newController: Function = (_:any) => {}
  private _lastMatch?: RegExpMatchArray | null

  constructor(url:URLMatcher, routeTo:string) {
    this.matcher = url
    this.destination = routeTo
    this.compile()
  }
  compile() {
    let [controllerName, action] = this.destination.split("#")
    controllerName = `${controllerName}Controller`
    this.actionName = action
    this.newController = new Function(`return new ${controllerName}()`)
  }
  dispatch() {
    this.newController()[this.actionName]({match:this._lastMatch})
    this._lastMatch = null
  }
  // TODO: more complex matchers
  match(location:Location) {
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

interface RouteBuilder {
  controller?: string
  action?: string
  readonly name: string
}

export class Router {
  private table: Route[]
  constructor() {
    this.table = []
  }
  go(location:Location) {
    let route = this.table.find((route) => route.match(location))
    if (route)
      route.dispatch()
  }
  get(url:URLMatcher, routeTo:string) {
    this.table.push(new Route(url, routeTo))
  }
  static get app() {
    return new Proxy(() => {}, {
      apply: function(obj : RouteBuilder) {
        return `${obj.controller}#${obj.action}`
      },
      get: function(obj : RouteBuilder, prop, receiver) {
        if (typeof prop !== "string") return

        if (prop[0] === prop[0].toUpperCase()) {
          obj.controller = String(prop)
        } else {
          obj.action = String(prop)
          // return `${obj.controller}#${obj.action}`
        }
        // console.log(`${obj.controller}#${obj.action}`)
        // console.log(receiver)
        return receiver
      }
    } )
  }
}