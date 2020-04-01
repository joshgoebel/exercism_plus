import { getEditor } from "./editor"
import { $ } from "./utils"


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

  const CODE_BLOCK_SNIPPET_RE = /```[\s\S]*?```/g
  const INLINE_CODE_RE = /`.*?`/g
  const QUOTED_RE = /^>.*$/m

  class ContentParser {
    constructor(text) {
      this.text = text
    }
    textualContent() {
      let text = this.text
        .replace(CODE_BLOCK_SNIPPET_RE,"")
        .replace(INLINE_CODE_RE,"")
        .replace(QUOTED_RE,"")
        .trim()
      return text
    }
  }

  export const editorTips = () => {
    let editor = getEditor()
    let markdownPane = document.querySelector('.pane.markdown')
    let tips = markdownPane.insertAdjacentElement('afterbegin',$("<ul></ul>"))
    editor.closest("form").addEventListener("submit", (event) => {
      tips.innerHTML="";
      if (editor._tipTimer) {
        clearTimeout(editor._tipTimer);
        editor._tipTimer = null;
      }
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

