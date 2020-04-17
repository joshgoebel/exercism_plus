import { $ } from "../utils"
import * as curl from "../lib/curl"

const db = localStorage

interface UserData {
  profileHTML: string
  saveAt?: Date
  id: string
  syncAt: Date | null
  isMentor: boolean
  fullName: string
}

type AnyUser = User | NoDataUser

export const whoami = () : AnyUser => {
  let person = document.querySelector(".logged-in .dropdown .person strong")
  if (!person) return new NoDataUser("Anonymous")

  return Users.findFast(person.innerHTML)
}

class NoDataUser implements UserData {
  profileHTML: string = ""
  id: string
  isMentor = false
  syncAt = null
  saveAt = undefined
  fullName = ""

  constructor(id: string) {
    this.id = id
    this.fullName = id
  }
  get sidebar() { return null }
}

class User implements UserData {
  profileHTML: string = ""
  saveAt?: Date
  id: string
  syncAt: Date | null = null
  isMentor : boolean = false
  fullName = ""
  constructor(data : Partial<UserData> & { id: string }) {
    // TODO: makes compiler happy, can we remove?
    this.id = data.id
    Object.assign(this, data)

    this.parse()
  }

  parse() {
    if (!this.sidebar) return

    this.isMentor = this.sidebar.querySelectorAll(".badges .mentor").length > 0
    this.fullName = this.sidebar.querySelector(".name")?.innerHTML || ""
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

  static persist(user : AnyUser) {
    if (!(user instanceof User)) return

    user.saveAt = new Date()
    db.setItem(`users/${user.id}`,JSON.stringify(user))
  }

  static fromHTML(html : string, {userId} : {userId: string}) {
    html = curl.trimBody(html)

    let dom = $(html).parentNode
    let sidebar = dom?.querySelector(".sidebar")
    if (!sidebar) return new NoDataUser(userId)

    let user = new User({
      id: userId,
      profileHTML: `<div>${sidebar.outerHTML}</div>`,
      syncAt: new Date()
    })

    return user
  }
}