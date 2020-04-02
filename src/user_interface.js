import { config } from "./config"
import { $ } from "./utils"

export const cleanerUI = () => {
    collapseCoreExercises();
    renameMentorTabs();
    cleanupSolutionList();
    cleanupPostsList();
    addFooter();
    useRealName();
    cleanupBreadcrumbs();
    if (document.querySelector("a.leave-button"))
        document.querySelector("a.leave-button").innerHTML="Leave"
  }

const collapseCoreExercises = () => {
document.querySelectorAll("ul.exercises li a.label").forEach(el => {
    if (el.innerHTML.includes("· 0"))
    el.parentNode.removeChild(el);
    el.innerHTML= el.innerHTML.replace(/\d+\. /,"").replace(" · 0","");
})
}

const renameMentorTabs = () => {
let waiting = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]')
let queue = document.querySelector('.header-tab[href="/mentor/dashboard/next_solutions"]')
if (!waiting) return;

queue.innerHTML = queue.innerHTML.replace(/.*(\(\d+\))/,
    "Queue $1")
waiting.innerHTML = waiting.innerHTML.replace(/.*(\(\d+\))/,
    "Mentoring $1")
}

const LEGAL = `
<div class="legal">
Exercism Plus is a <a href="https://github.com/yyyc514/exercism_plus">tiny little extension</a>,
devoted to helping improve your Exercism experience, and supported by
<a href="https://github.com/yyyc514/exercism_plus/graphs/contributors">2 wonderful contributors</a>.
</div>
`

const addFooter = () => {
let legal = document.querySelector("footer .legal")
if (!legal) return;

legal.insertAdjacentElement('beforebegin',$(LEGAL))
legal.style.marginTop=0;
}

const cleanupSolutionList = () => {
  document.querySelectorAll(".solution .details .extra .submitted-at").forEach((el) => {
      el.innerHTML = el.innerHTML.replace(/for mentoring|about/g,"")
  })
  document.querySelectorAll(".solution .details .iteration").forEach((el) => {
      let handle = el.parentNode.parentNode.querySelector(".title .handle")
      handle.remove()
      let user = handle.innerHTML.replace("'s","")
      el.innerHTML = `${el.innerHTML} by ${user}`
  })
}

const cleanupPostsList = () => {
document.querySelectorAll(".post-body .created-at").forEach((el) => {
    el.innerHTML = el.innerHTML.replace(/posted|about/g,"")
});
}

const useRealName = () => {
document.querySelectorAll(".post-body .user-handle").forEach((el) => {
    let role = el.parentNode.querySelector(".user-role")
    if (el.innerHTML === config.username) {
    el.innerHTML = config.realname;
    role.remove();
    }
    // there is only a single student it's hard to get confused about who that is
    if (role && role.innerHTML.trim()==="Student") {
    role.remove()
    }
    if (el.innerHTML === "Automated Message") {
    el.innerHTML = "Exercism";
    }
})
}

const cleanupBreadcrumbs = () => {
let breadcrumbs = document.querySelector("nav.breadcrumb")
if (!breadcrumbs) return;

let links = breadcrumbs.querySelectorAll("a")
// ugh, what's the point of a single breadcrumb that points to our current page?
if (links.length === 1) {
    breadcrumbs.remove();
}
}

