import { config } from "../config"
import { $ } from "../utils"

const whoami = () => {
    let person = document.querySelector(".logged-in .dropdown .person strong")
    return person && person.innerHTML
}

export const useRealNames = () => {
    document.querySelectorAll(".post-body .user-handle").forEach((el) => {
        let role = el.parentNode.querySelector(".user-role")
        if (el.innerHTML === whoami()) {
            el.innerHTML = config.realname || whoami();
            role && role.remove();
        }
        // there is only a single student it's hard to get confused about who that is
        // But don't remove the role if we're looking at someone else's review.
        if (role && role.innerHTML.trim()==="Student" && el.innerHTML !== "[Redacted]") {
            role.remove()
        }
        if (el.innerHTML === "Automated Message") {
            el.innerHTML = "Exercism";
        }
    })
}

export const addPopoutToggleButton = () => {
    let tabs = document.querySelector(".new-editable-text .tabs")
    let btn = $(`<i title="Pop-out editor" aria-hidden="true" class="pop far fa-window-restore"></i>`)
    tabs.insertAdjacentElement("beforeend",btn)
    btn.addEventListener("click",(ev) => {
        togglePopoutEditor();
    })

}

export const togglePopoutEditor = () => {
    let editor = document.querySelector(".new-editable-text")
    let rhs = document.querySelector(".rhs .discussion")

    editor.classList.toggle("popout")
    if (editor.classList.contains("popout")) {
        editor.style.width = `${rhs.clientWidth}px`
    } else {
        editor.style.width = null
    }
}