import * as views from "../views/dashboard"

export class DashboardController {
  constructor() {
    views.renameDashboardTabs()
  }

  next_solutions() {
    views.collapseCoreExercises()
    views.cleanupSolutionList()
  }
  your_solutions() {
    views.cleanupSolutionList()
  }
  testimonials() {

  }
}