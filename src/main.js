import { fixEditorKeystrokes } from "./bold_and_italic"
import { getEditor } from "./editor"
import * as utils from "./utils"
import { cleanerUI } from "./user_interface"
import { config } from "./config"
import { $ } from "./utils"
import { editorTips } from "./textual_analysis"
import { DashboardController } from "./controllers/dashboard"
import { Router } from "./lib/router"


const PRIVATE_URL_RE = /exercism\.io\/solutions\/([a-z0-9]+$)/
const NOT_PUBLIC_TEXT = "solution is not public"

const redirectToMentoringURL = () => {
  let m = window.location.href.match(PRIVATE_URL_RE)
  if (m && document.body.innerHTML.includes(NOT_PUBLIC_TEXT)) {
    utils.redirect(`/mentor/solutions/${m[1]}`)
  }
}


import { MentorSolutionView } from "./mentor_solution"

const keybindings = () => {
  // todo abstract way more later
  document.addEventListener("keyup", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.target.tagName=="INPUT") return;
    if (event.target.tagName=="TEXTAREA") return;

    if (event.key=="n") {
      utils.redirect("/mentor/dashboard/next_solutions")
    }
    if (event.key==";") {
      utils.redirect("/my/notifications")
    }
    // console.log(ev)
  })

}

const router = new Router();

let app = new Proxy(() => {}, {
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

// dashboard
// router.get("/mentor/dashboard/next_solutions", "Dashboard#next_solutions")
// console.log(app.Dashboard.next_solutions)
router.get("/mentor/dashboard/next_solutions", app.Dashboard.next_solutions())
router.get("/mentor/dashboard/your_solutions","")
router.get("/mentor/dashboard/testimonials","")

import * as commonViews from "./views/common"

const boot = async () => {
  redirectToMentoringURL();
  cleanerUI();


  if (getEditor()) {
    if (utils.onMacintosh())
      fixEditorKeystrokes();
    editorTips();
  }

  new MentorSolutionView().render()
  keybindings();

  commonViews.addNewSolutionsMenuLink();
  commonViews.addFooter();
  commonViews.cleanupBreadcrumbs();

  router.go(location)
}

document.addEventListener("DOMContentLoaded", () => {
  boot();
})


