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

const boot = () => {
  redirectToMentoringURL();
  cleanerUI();
  addNewSolutionsMenuLink();

  if (getEditor()) {
    if (utils.onMacintosh())
      fixEditorKeystrokes();
    editorTips();
  }

  // fetch("https://exercism.io/my/notifications")
  //   .then((resp) => resp.blob())
  //   .then((blob) => blob.text())
  //   .then((text) => console.log(text))

}

document.addEventListener("DOMContentLoaded", () => {
  boot();
})


