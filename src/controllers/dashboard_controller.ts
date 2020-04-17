import * as views from "../views/dashboard"

export class DashboardController {
  constructor() {
    views.renameDashboardTabs()
  }

  next_solutions() {
    // document.querySelector(".h1-subtitle").innerHTML="Solutions are are ordered algorithmically with the most important at the top."
    views.collapseCoreExercises()
    views.cleanupSolutionList()
    views.fixDropdownFilter()
    // setTimeout(() => {views.fixDropdownFilter() }, 500)

  }
  your_solutions() {
    views.cleanupSolutionList()
  }
  testimonials() {

  }
}