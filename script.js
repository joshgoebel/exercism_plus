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

const getEditor = () => document.querySelector('textarea.md-input[name="discussion_post[content]"]');

const fixEditorKeystrokes = () => {
  if(!getEditor()) return;

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

const TIPS = [
  [/[A-Z]{5}/, "Don't YELL at your students, try bold or italics instead."],
  [/\b(no one|nobody)\b/i, "Try not to speak in absolutes."],
  [/\b(your code)\b/i, "Try <i>the code</i> vs <i>your code</i>, make it less personal."],
  [/\bjust\b/,"&quot;just&quot; can come across as insulting for some."],
  [/\byou don't need\b/i,"Try speaking more suggestively, less imperatively."],
  [/\breally\b/i,"Is really <i>really</i> necessary?"],
]

class ContentParser {
  constructor(text) {
    this.text = text
  }
  textualContent() {
    return this.text
  }
}

const editorTips = () => {
  let editor = getEditor()
  let markdownPane = document.querySelector('.pane.markdown')
  let tips = markdownPane.insertAdjacentElement('afterbegin',$("<ul></ul>"))
  // TODO: add a delay timer so do don't fire every single time a key is hit
  editor.addEventListener("keyup", (event) => {
    let text = new ContentParser(editor.value).textualContent()
    tips.innerHTML="";
    for (let [matcher,suggestion] of TIPS) {
      if (matcher.test(text)) {
        tips.appendChild($(`<li>${suggestion}</li>`))
      }
    }

  });
}

const onMacintosh = () => {
  return /Macintosh/.test(navigator.userAgent)
}

const boot = () => {
  addNewSolutionsMenuLink();

  if (getEditor()) {
    if (onMacintosh())
      fixEditorKeystrokes();
    editorTips();
  }
}

boot();

