function $(html) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  return wrapper.firstChild;
}

// TODO: Add settings panel
const config = {
  username: "ajoshguy",
  realname: "Josh G."
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
  [/\bi think\b/i, "You think? Is there a way to sound less uncertain?"],
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

const renameMentorTabs = () => {
  let waiting = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]')
  let queue = document.querySelector('.header-tab[href="/mentor/dashboard/next_solutions"]')
  if (!waiting) return;

  queue.innerHTML = queue.innerHTML.replace(/.*(\(\d+\))/,
    "Queue $1")
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

const addFooter = () => {
  let legal = document.querySelector("footer .legal")
  if (!legal) return;

  legal.insertAdjacentElement('beforebegin',$(LEGAL))
  legal.style.marginTop=0;
}

const cleanupSolutionList = () => {
  document.querySelectorAll(".solution .details .extra .submitted-at").forEach((el) => {
    el.innerHTML = el.innerHTML.replace("for mentoring","")
  })
}

const cleanupPostsList = () => {
  document.querySelectorAll(".post-body .created-at").forEach((el) => {
    el.innerHTML = el.innerHTML.replace("posted","")
  });
}

const useRealName = () => {
  document.querySelectorAll(".post-body .user-handle").forEach((el) => {
    if (el.innerHTML === config.username) {
      el.innerHTML = config.realname;
      el.parentNode.querySelector(".user-role").remove();
    }
  })
}

const cleanUI = () => {
  collapseCoreExercises();
  renameMentorTabs();
  cleanupSolutionList();
  cleanupPostsList();
  addFooter();
  useRealName();
}

const boot = () => {
  cleanUI();
  addNewSolutionsMenuLink();

  if (getEditor()) {
    if (onMacintosh())
      fixEditorKeystrokes();
    editorTips();
  }

  // fetch("https://exercism.io/my/notifications")
  //   .then((resp) => resp.blob())
  //   .then((blob) => blob.text())
  //   .then((text) => console.log(text))

}

document.addEventListener("DOMContentLoaded", () => {
  boot();
})


