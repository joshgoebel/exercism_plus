import { Router } from "../lib/router"

// controllers
import "../controllers/mentor_controller"
import "../controllers/dashboard_controller"
import "../controllers/profiles_controller"

const router = new Router()
let app = Router.app as any

// dashboard
router.get("/mentor/dashboard/next_solutions", app.Dashboard.next_solutions())
router.get("/mentor/dashboard/your_solutions",app.Dashboard.your_solutions())
router.get("/mentor/dashboard/testimonials",app.Dashboard.testimonials())

// solutions
router.get(/^\/solutions\/(?<id>[a-z0-9]+$)/,app.Mentor.solution_not_public())
router.get(/^\/mentor\/solutions\/(?<id>[a-z0-9]+$)/,app.Mentor.solution())

// profiles
router.get(/^\/profiles\/(?<username>[a-z0-9]+$)/, app.Profiles.show())

export { router as routes }