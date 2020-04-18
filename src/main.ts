import * as utils from "./lib/utils"
import * as commonViews from "./views/common"
import * as discussion from "./views/discussion"
import { routes }  from "./config/routes"

import "./css/features.scss"
import "./css/monolith.css"

const keybindings = () => {
  // todo abstract way more later
  document.addEventListener("keyup", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return

    let element = event.target as HTMLElement
    if (element.tagName=="INPUT") return
    if (element.tagName=="TEXTAREA") return

    if (event.key==="n") {
      utils.redirect("/mentor/dashboard/next_solutions")
    }
    if (event.key===";") {
      utils.redirect("/my/notifications")
    }
    if (event.key==="w") {
      document.body.classList.toggle("doublewide")
    }
    if (event.key==="/") {
      discussion.togglePopoutEditor()
    }
    // console.log(ev)
  })

}

const boot = () => {
  keybindings()

  commonViews.addNewSolutionsMenuLink()
  commonViews.addFooter()
  commonViews.cleanupBreadcrumbs()

  routes.go(location)
}

document.addEventListener("DOMContentLoaded", () => {
  boot()
})




