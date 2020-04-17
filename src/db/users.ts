import { $ } from "../utils"
import * as curl from "../lib/curl"

const db = localStorage

interface UserData {
  profileHTML: string
  saveAt?: Date
  id: string
  syncAt: Date | null
}

class User implements UserData {
  profileHTML: string
  saveAt?: Date
  id: string
  syncAt: Date | null = null
  constructor(data : UserData) {
    this.profileHTML = ""
    // TODO: makes compiler happy, can we remove?
    this.id = data.id
    Object.assign(this, data)
  }

  get sidebar() {
    let dom = $(this.profileHTML)
    return dom.parentNode?.querySelector(".sidebar")
  }

}
export class Users {

  static find(id:string) {
    let item = db.getItem(`users/${id}`)
    if (item) {
      console.log(`CACHE: User[${id}]`)
      console.log(item)
      return new User(JSON.parse(item))
    }
  }

  static async get(id:string) {
    let user = this.find(id)
    if (user) return user

    let html = await curl.get(`https://exercism.io/profiles/${id}?track_id=999`)
    if (!html) return null

    return this.fromHTML(html, {userId: id})
  }

  static persist(user : User) {
    user.saveAt = new Date()
    db.setItem(`users/${user.id}`,JSON.stringify(user))
  }

  static fromHTML(html : string, {userId} : {userId: string}) {
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