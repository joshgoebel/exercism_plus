import * as utils from "../utils"
import * as views from "../views/mentor"
import * as discussionView from "../views/discussion"
import { fixEditorKeystrokes } from "../fixups/bold_and_italic"
import { MentorSolutionView } from "../views/mentor_solution"
import { NewMessagesView } from "../views/new_messages_view"
import { editorTips } from "../textual_analysis"
import { BaseController } from "./base_controller"

import { BUS, EventType } from "../lib/events"


const NOT_PUBLIC_TEXT = "solution is not public"

const removeNotification = () => {
  let notification = document.querySelector(".tools-bar .notification")
  if (notification) notification.remove()
}

const newCommentsPosted = (event? : Event | null) => {
  console.log(event)

  views.cleanupPostsTimestamps()
  discussionView.useRealNames();
  if (utils.onMacintosh())
    fixEditorKeystrokes();

  // posting counts as responding to the notification
  if (event)
    removeNotification();

  BUS.fire(EventType.newComment)
  hookForms();
}

const hookForms = () => {
  document.querySelectorAll("form").forEach((frm) => {
    if (frm._hooked) return;

    frm.addEventListener("ajax:success",newCommentsPosted);
    frm._hooked = true
  });
}


export class MentorController extends BaseController {
  constructor() {
    super()
  }

  solution(req: ActionRequest) {
    editorTips();
    views.tweakNotificationText();
    views.renameLeaveButton()
    new MentorSolutionView().render()

    // call this once to handle the comments that
    // are on the page when we first load it
    newCommentsPosted();

    // alert(req.match.groups!.id);
    new NewMessagesView({solution: req.match.groups!.id, params: this.searchParams})

    // document.body.addEventListener("ajax:send", (event) => {
    // document.body.addEventListener("ajax:stopped", (event) => {
    // document.body.addEventListener("ajax:complete", (event) => {
    // document.body.addEventListener("ajax:error", (event) => {
    // document.body.addEventListener("ajax:success", (event) => {
  }

  solution_not_public({match }: ActionRequest) {
    if (document.body.innerHTML.includes(NOT_PUBLIC_TEXT)) {
      utils.redirect(`/mentor/solutions/${match.groups!.id}`)
    }
  }
}


