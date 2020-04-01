import { $ } from "../utils"


const db = localStorage

class User {
    static find(id) {
        let item
        if (item = db.getItem(`users/${id}`)) {
            return JSON.parse(item)
        }
    }
}
export class Users {

    static async get(id) {
        // let user = User.find(id)
        // if (user) return user

        let page = await fetch(`https://exercism.io/profiles/${id}?track_id=999`)
            .then((resp) => resp.blob())
            .then((blob) => blob.text())
            .then((html) => this.fromHTML(html))
            .catch(error => null)
        return page
    }
    static fromHTML(html) {
      let start = html.indexOf("<body")
      html = html.slice(start)
      let end = html.indexOf("</body>")
      html = html.slice(0,end+7)

      let dom = $(html)
      return dom.parentNode.querySelector(".sidebar")

  // let data = $(user)
  // console.log(data)
  // document.body.appendChild(data)
  // let sidebar = data.parentNode.querySelector(".sidebar")


        return html
    }
}