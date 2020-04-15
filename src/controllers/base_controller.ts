export class BaseController {
  searchParams : URLSearchParams
  constructor() {
    this.searchParams = (new URL(document.location.href)).searchParams;
  }
}