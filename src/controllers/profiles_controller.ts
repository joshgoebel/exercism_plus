// import * as views from "../views/dashboard"
import { BaseController } from "./base_controller"
import { Users } from "../db/users"

export class ProfilesController extends BaseController {
  constructor() {
    super()
  }

  show({match }: ActionRequest) {
    let username = match.groups!.username

    // save a users profile if we just happen to be looking at it
    let user = Users.fromHTML(document.documentElement.outerHTML, {userId: username})
    Users.persist(user)
  }
}