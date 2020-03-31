function $(html) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
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

  let editors = document.querySelectorAll('textarea[name="discussion_post[content]"]')

  editors.forEach((editor) => {
    editor.addEventListener("keydown", (event) => {
      let click = new MouseEvent('click', { bubbles: true});
      if (event.metaKey && event.key=="b") {
        let boldButton = editor.parentNode.querySelector('button[data-hotkey="Ctrl+B"]')
        boldButton.dispatchEvent(click);
      }
      if (event.metaKey && event.key=="i") {
        let italicButton = editor.parentNode.querySelector('button[data-hotkey="Ctrl+I"]')
        italicButton.dispatchEvent(click);
      }
    })
  })

}

const TIPS = [
  [/[A-Z]{5}/, "Don't YELL at your students, try bold or italics instead."],
  [/\b(never|always)\b/i, "Try not to speak in absolutes."],
  [/\b(no one|nobody)\b/i, "Try not to speak in absolutes."],
  [/\bjust\b/,"&quot;just&quot; can come across as insulting for some."],
  [/\breally\b/i,"Is really <i>really</i> necessary?"],
  [/\byou do not\b/i,"Try speaking more suggestively, less imperatively."],
  [/\byou don't\b/i,"Try speaking more suggestively, less imperatively."],
  [/\byou need\b/i,"Try speaking more suggestively, less imperatively."],
  [/\byou\b/i,"Is it them, or is it the code?  Avoid 'you' if possible."],
  [/\byour code\b/i, "Try <i>the code</i> vs <i>your code</i>, make it less personal."],
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
  editor.closest("form").addEventListener("submit", (event) => {
    tips.innerHTML="";
  })
  editor.addEventListener("keyup", (event) => {
    if (editor._tipTimer)
      return;

    // we only fire every 500ms, should be responsive enough
    editor._tipTimer = setTimeout(() => {
      editor._tipTimer = null
      let text = new ContentParser(editor.value).textualContent()
      tips.innerHTML="";
      for (let [matcher,suggestion] of TIPS) {
        if (matcher.test(text)) {
          tips.appendChild($(`<li>${suggestion}</li>`))
        }
      }
    },500);
  });
}

const onMacintosh = () => {
  return /Macintosh/.test(navigator.userAgent)
}

const collapseCoreExercises = () => {
  document.querySelectorAll("ul.exercises li a.label").forEach(el => {
    if (el.innerHTML.includes("· 0"))
      el.parentNode.removeChild(el);
    el.innerHTML= el.innerHTML.replace(/\d+\. /,"").replace(" · 0","");
  })
}

const renameSolutionsYourMentoring = () => {
  let waiting = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]')
  if (!waiting) return;

  waiting.innerHTML = waiting.innerHTML.replace(/.*(\(\d+\))/,
    "Mentoring $1")
}

const LEGAL = `
<div class="legal">
  Exercism Plus is a <a href="https://github.com/yyyc514/exercism_plus">tiny little extension</a>,
  devoted to helping improve your Exercism experience, and supported by
  <a href="https://github.com/yyyc514/exercism_plus/graphs/contributors">2 wonderful contributors</a>.
</div>
`

const cleanUI = () => {
  collapseCoreExercises();
  renameSolutionsYourMentoring();
  document.querySelectorAll(".solution .details .extra .submitted-at").forEach((el) => {
    el.innerHTML = el.innerHTML.replace("for mentoring","")
  })
  let legal = document.querySelector("footer .legal")
  if (legal) {
    legal.insertAdjacentElement('beforebegin',$(LEGAL))
    legal.style.marginTop=0;
  }
}

const boot = () => {
  cleanUI();
  addNewSolutionsMenuLink();

  if (getEditor()) {
    if (onMacintosh())
      fixEditorKeystrokes();
    editorTips();
  }
}

boot();

