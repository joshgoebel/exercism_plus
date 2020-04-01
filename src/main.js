import { fixEditorKeystrokes } from "./bold_and_italic"
import { getEditor } from "./editor"
import * as utils from "./utils"
import { cleanerUI } from "./user_interface"
import { config } from "./config"
import { $ } from "./utils"
import { editorTips } from "./textual_analysis"


const addNewSolutionsMenuLink = () => {
  let dashboard = document.querySelector('.dropdown a[href*="/mentor/dashboard"]')
  dashboard.insertAdjacentElement('afterend',
    $("<li><a href='/mentor/dashboard/next_solutions'>Queue</a></li>"))
}

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

const boot = async () => {
  redirectToMentoringURL();
  cleanerUI();
  addNewSolutionsMenuLink();

  if (getEditor()) {
    if (utils.onMacintosh())
      fixEditorKeystrokes();
    editorTips();
  }

  new MentorSolutionView().render()
  keybindings();

  // fetch("https://exercism.io/my/notifications")
  //   .then((resp) => resp.blob())
  //   .then((blob) => blob.text())
  //   .then((text) => console.log(text))

}

document.addEventListener("DOMContentLoaded", () => {
  boot();
})


