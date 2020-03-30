function $(html) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.firstChild;
}

const addNewSolutionsMenuLink = () => {
  let dashboard = document.querySelector('.dropdown a[href*="/mentor/dashboard"]')
  dashboard.insertAdjacentElement('beforebegin',
    $("<li><a href='/mentor/dashboard/next_solutions'>New solutions</a></li>"))
}

const boot = () => {
  addNewSolutionsMenuLink();
}

boot();