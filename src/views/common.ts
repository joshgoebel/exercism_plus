import { $ } from "../utils"

export const cleanupBreadcrumbs = () => {
    let breadcrumbs = document.querySelector("nav.breadcrumb")
    if (!breadcrumbs) return;

    let links = breadcrumbs.querySelectorAll("a")
    // ugh, what's the point of a single breadcrumb that points to our current page?
    if (links.length === 1) {
        breadcrumbs.remove();
    }
}

export const addNewSolutionsMenuLink = () => {
    let dashboard = document.querySelector('.dropdown a[href*="/mentor/dashboard"]')
    if (!dashboard) return;

    dashboard.insertAdjacentElement('afterend',
        $("<li><a href='/mentor/dashboard/next_solutions'>Queue</a></li>"))
}



const LEGAL = `
<div class="legal">
Exercism Plus is a <a href="https://github.com/yyyc514/exercism_plus">tiny little extension</a>,
devoted to helping improve your Exercism experience, and supported by
<a href="https://github.com/yyyc514/exercism_plus/graphs/contributors">3 wonderful contributors</a>.
</div>
`

export const addFooter = () => {
    let legal = document.querySelector<HTMLElement>("footer .legal");
    if (!legal) return;

    legal.insertAdjacentElement('beforebegin',$(LEGAL));
    legal.style.marginTop="0px";
}