import * as utils from "../utils"
import * as views from "../views/mentor"
import * as discussionView from "../views/discussion"
import { fixEditorKeystrokes } from "../fixups/bold_and_italic"
import { MentorSolutionView } from "../views/mentor_solution"
import { editorTips } from "../textual_analysis"


const NOT_PUBLIC_TEXT = "solution is not public"

export class MentorController {
  constructor() {
  }
  solution({match}) {
    if (utils.onMacintosh())
      fixEditorKeystrokes();

    discussionView.useRealNames();
    editorTips();
    views.cleanupPostsTimestamps()
    views.renameLeaveButton()
    new MentorSolutionView().render()
  }
  solution_not_public({match}) {
    if (document.body.innerHTML.includes(NOT_PUBLIC_TEXT)) {
      utils.redirect(`/mentor/solutions/${match.groups.id}`)
    }
  }
}


