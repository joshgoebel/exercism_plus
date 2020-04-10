import { $ } from "../utils"
import { Users } from "../db/users"
import * as discussionView from  "./discussion"

export class MentorSolutionView {
  stickyLeftSide() {
    const panes = document.querySelector<HTMLElement>("#mentor-solution-page .lhs .tabs-and-panes")
    if (!panes) return;

    const doSticky = () => {
      const windowHeight = window.innerHeight
      const height = panes.offsetHeight
      panes.classList.toggle("stickySubmission", windowHeight > height);
      // HACK: because of bug in Exercism tabs.js implementation
      panes.className = panes.className.replace(/^(.*)\b(selected-\d)\b(.*)$/,"$1 $3 $2")
    }
    doSticky()
    // every time a tab is clicked we need to rethink our stickiness because
    // the height of the content can change
    panes.addEventListener("click", doSticky)
  }

  async render() {

    this.stickyLeftSide();
    discussionView.addPopoutToggleButton();

    let profileLink = document.querySelector("#mentor-solution-page .track-header .byline a")
    if (!profileLink) return;

    let userid = profileLink.innerHTML
    let user = await Users.get(userid)
    Users.persist(user)
    // TODO: remove the ! here
    let sidebar = user!.sidebar
    if (!sidebar) return;

    if (sidebar.querySelector(".badge.mentor")) {
      sidebar.querySelector(".name")!.classList.add("mentor")
    }
    sidebar.querySelectorAll(".badge").forEach((badge) =>
      badge.innerHTML = badge.innerHTML.replace("mentor",""))

    // if discussion is immediately under rhs then there is an ongoing visible discussion
    // otherwise this might not be claimed yet
    let discussion = (document.querySelector(".rhs > .discussion") || document.querySelector(".claimed-section"))!
    console.log(discussion)
    discussion.insertAdjacentElement("beforebegin", sidebar)
    if (discussion.classList.contains("discussion")) {
      discussion.querySelector("h3")!.innerHTML="Discussion"
      sidebar.insertAdjacentElement("afterbegin",$("<h4>Who you're mentoring</h4>"))
    } else {
      sidebar.insertAdjacentElement("afterbegin",$("<h4>Who you'll be mentoring</h4>"))
    }
  }
}