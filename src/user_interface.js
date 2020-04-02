import { config } from "./config"
import { $ } from "./utils"

export const cleanerUI = () => {
    cleanupSolutionList();
    cleanupPostsList();
    useRealName();
    if (document.querySelector("a.leave-button"))
        document.querySelector("a.leave-button").innerHTML="Leave"
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

