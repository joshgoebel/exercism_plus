export const renameDashboardTabs = () => {
    let waiting = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]')
    let queue = document.querySelector('.header-tab[href="/mentor/dashboard/next_solutions"]')
    if (!waiting) return;

    queue.innerHTML = queue.innerHTML.replace(/.*(\(\d+\))/,
        "Queue $1")
    waiting.innerHTML = waiting.innerHTML.replace(/.*(\(\d+\))/,
        "Mentoring $1")
}

export const collapseCoreExercises = () => {
    document.querySelectorAll("ul.exercises li a.label").forEach(el => {
        if (el.innerHTML.includes("· 0"))
        el.parentNode.removeChild(el);
        el.innerHTML= el.innerHTML.replace(/\d+\. /,"").replace(" · 0","");
    })
}
