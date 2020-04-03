import { config } from "./config"

export const cleanerUI = () => {
    useRealName();
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

