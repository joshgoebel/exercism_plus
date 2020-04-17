import { $ } from "../utils"
import * as curl from "../lib/curl"

const db = localStorage

interface UserData {
  profileHTML: string
  saveAt?: Date
  id: string
  syncAt: Date | null
  isMentor: boolean
}

class NoDataUser implements UserData {
  profileHTML: string = ""
  id: string
  isMentor = false
  syncAt = null
  saveAt = undefined

  constructor(id: string) {
    this.id = id
  }
  sidebar = () => null
}

class User implements UserData {
  profileHTML: string = ""
  saveAt?: Date
  id: string
  syncAt: Date | null = null
  isMentor : boolean = false
  constructor(data : Partial<UserData> & { id: string }) {
    // TODO: makes compiler happy, can we remove?
    this.id = data.id
    Object.assign(this, data)

    this.parse()
  }

  parse() {
    if (!this.sidebar) return

    this.isMentor = this.sidebar.querySelectorAll(".badges .mentor").length > 0
  }

  get sidebar() {
    let dom = $(this.profileHTML)
    return dom.parentNode?.querySelector(".sidebar") || null
  }

}


export class Users {

  // fetches cached user data or returns an empty user
  static findFast(id: string) {
    let user = this.find(id)
    if (user) return user

    return new NoDataUser(id)
  }

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