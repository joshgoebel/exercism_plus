import { config } from "../config"

const whoami = () => {
    let person = document.querySelector(".logged-in .dropdown .person strong")
    return person && person.innerHTML
}

export const useRealNames = () => {
    document.querySelectorAll(".post-body .user-handle").forEach((el) => {
        let role = el.parentNode.querySelector(".user-role")
        if (el.innerHTML === whoami()) {
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

