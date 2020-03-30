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

const getEditor = () => document.querySelector('textarea[name="discussion_post[content]"]');

const fixEditorKeystrokes = () => {
  let boldButton = document.querySelector('button[data-hotkey="Ctrl+B"]')
  let italicButton = document.querySelector('button[data-hotkey="Ctrl+I"]')
  getEditor().addEventListener("keydown", (event) => {
    let click = new MouseEvent('click', { bubbles: true});
    if (event.metaKey && event.key=="b") {
      boldButton.dispatchEvent(click);
    }
    if (event.metaKey && event.key=="i") {
      italicButton.dispatchEvent(click);
    }
  })

}

const onMacintosh = () => {
  return /Macintosh/.test(navigator.userAgent)
}

const boot = () => {
  addNewSolutionsMenuLink();
  if (onMacintosh())
    fixEditorKeystrokes();
}

boot();