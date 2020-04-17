import * as utils from "../lib/utils"

export class BaseController {
  searchParams : URLSearchParams
  constructor() {
    this.searchParams = (new URL(document.location.href)).searchParams;
  }
  redirect(url:string) {
    utils.redirect(url)
  }
}