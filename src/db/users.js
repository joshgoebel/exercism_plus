import { $ } from "../utils"
import * as curl from "../lib/curl"

const db = localStorage

class User {
  constructor(data) {
    Object.assign(this, data)
  }

  get sidebar() {
    let dom = $(this.profileHTML)
    return dom.parentNode.querySelector(".sidebar")
  }

}
export class Users {

  static find(id) {
    let item
    if (item = db.getItem(`users/${id}`)) {
      console.log(`CACHE: User[${id}]`)
      console.log(item)
      return new User(JSON.parse(item))
    }
  }

  static async get(id) {
    let user = this.find(id)
    if (user) return user

    let html = await curl.get(`https://exercism.io/profiles/${id}?track_id=999`)
    if (!html) return null

    return this.fromHTML(html, {userId: id})
  }

  static persist(user) {
    user.saveAt = new Date()
    db.setItem(`users/${user.id}`,JSON.stringify(user))
  }

  static fromHTML(html, {userId}) {
    html = curl.trimBody(html)

    // todo handle sidebar not found

    let user = new User({
      id: userId,
      profileHTML: html,
      syncAt: new Date()
    })

    return user
  }
}