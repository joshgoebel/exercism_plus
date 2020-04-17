import { $ } from "../utils"

// export const fixDropdownFilter = () => {
//     const filter = document.querySelector<HTMLSelectElement>("form select[name=next_track_id]")
//     if (!filter) return;

//     const form = filter.closest("form")!
//     // why doesn't this work
//     const _submit = form.submit // native submit
//     form.submit = () => { window.alert("submit hack"); // then call original submit }

//     // this didn't work because submit() doesn't fire events
//     // form.addEventListener("submit", (event) => {})
// }

export const fixDropdownFilter = () => {
  const filter = document.querySelector<HTMLSelectElement>("form select[name=next_track_id]")
  if (!filter) return
  // return

  // const form = filter.closest("form")!
  const selectedTrack = filter.value

  // const _action = form.action
  //@ts-ignore
  // form.action="javascript:"

  let event = new MouseEvent('click', { bubbles: true})
  let el = document.querySelector<HTMLElement>("div.track_id .selectize-input")!
  el.dispatchEvent(event)

  filter.classList.remove("selectized")
  // give time for the click to open the selectize which has
  // stolen all the options from our select (why?)
  setTimeout(() => {
    filter.innerHTML = ""
    el = document.querySelector<HTMLElement>("div.track_id .selectize-control")!
    el.querySelectorAll<HTMLElement>(".option").forEach((op)  => {
      let selected = op.classList.contains("selected")
      filter.appendChild($(`<option ${selected} value="${op.dataset.value}">${op.innerText}</option>`))
    })
    filter.value = selectedTrack
  },10)

  // why didn't all this work?
  // form.submit = () => {
  //   window.alert("submit hack")

  // }
  // this didn't work because submit() doesn't fire events
  // form.addEventListener("submit", (event) => {})
  // console.log(filter)

  // console.log(filter)
  // const observer = new MutationObserver((list, obs) => {
  //     // let x= document.querySelector<HTMLSelectElement>("form select[name=next_track_id]")?.closest("form").sub
  //     // console.log(x)
  //     if (filter.value==="") return;
  //     form.action = _action;
  //     form.submit();
  //     // console.log(list)
  // })
  // observer.observe(filter, { childList: true, subtree: true })
  // filter.addEventListener("change", (event) => {
  //     console.log(event)
  //     if (filter.value==="") return;

  //     form.action = _action;
  //     form.submit();
  // })

}

export const renameDashboardTabs = () => {
  let mentoring = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]')
  if (!mentoring) return

  let queue = document.querySelector('.header-tab[href="/mentor/dashboard/next_solutions"]') as HTMLElement

  queue.innerHTML = queue.innerHTML.replace(/.*(\(\d+\))/,
    "Queue $1")
  mentoring.innerHTML = mentoring.innerHTML.replace(/.*(\(\d+\))/,
    "Mentoring $1")
}

export const collapseCoreExercises = () => {
  document.querySelectorAll("ul.exercises li a.label").forEach(el => {
    if (el.innerHTML.includes("· 0") && !el.classList.contains("selected"))
      el.parentNode!.removeChild(el)
    el.innerHTML= el.innerHTML.replace(/\d+\. /,"").replace(" · 0","")
  })
}

export const cleanupSolutionList = () => {
  document.querySelectorAll(".solution .details .extra .submitted-at").forEach((el) => {
    el.innerHTML = el.innerHTML.replace(/Last updated|Submitted|for mentoring|about/g,"")
  })
  document.querySelectorAll(".solution .details .extra .iteration").forEach((el) => {
    el.innerHTML = el.innerHTML
      .replace(/#/g,"")
      .replace(/Iteration 1/g,"")

  })
  document.querySelectorAll(".solution .details .iteration").forEach((el) => {
    let handle = el.parentNode!.parentNode!.querySelector(".title .handle")!
    handle.remove()
    let user = handle.innerHTML.replace("'s","")
    el.innerHTML = `${el.innerHTML} <span>by</span> ${user}`
  })
}

