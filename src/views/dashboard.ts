export const renameDashboardTabs = () => {
    let mentoring = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]')
    if (!mentoring) return;

    let queue = document.querySelector('.header-tab[href="/mentor/dashboard/next_solutions"]') as HTMLElement

    queue.innerHTML = queue.innerHTML.replace(/.*(\(\d+\))/,
        "Queue $1")
    mentoring.innerHTML = mentoring.innerHTML.replace(/.*(\(\d+\))/,
        "Mentoring $1")
}

export const collapseCoreExercises = () => {
    document.querySelectorAll("ul.exercises li a.label").forEach(el => {
        if (el.innerHTML.includes("· 0") && !el.classList.contains("selected"))
            el.parentNode!.removeChild(el);
        el.innerHTML= el.innerHTML.replace(/\d+\. /,"").replace(" · 0","");
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

