import * as utils from "../utils"

const NOT_PUBLIC_TEXT = "solution is not public"

export class MentorController {
  constructor() {
  }
  solution_not_public({match}) {
    if (document.body.innerHTML.includes(NOT_PUBLIC_TEXT)) {
      utils.redirect(`/mentor/solutions/${match.groups.id}`)
    }
  }
}