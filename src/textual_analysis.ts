import { getEditor } from "./editor"
import { $ } from "./utils"


const TIPS : [RegExp, string][] = [
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

class SimpleMatcher {
  private rule : RegExp
  private advice : string
  private text : string = ""
  constructor([rule, advice] : [RegExp, string]) {
    this.rule = rule
    this.advice = advice
  }
  check(text: string) {
    this.text = text
  }
  tips() {
    if (this.rule.test(this.text)) {
      return [ this.advice ]
    }
    return []
  }
}

class ContentParser {
  private text:string
  constructor(text:string) {
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

interface EditorElement extends HTMLTextAreaElement {
  _tipTimer: NodeJS.Timeout | null
}

export const editorTips = () => {
  let editor = getEditor() as EditorElement
  if (!editor) return

  let markdownPane = document.querySelector('.pane.markdown')
  if (!markdownPane) return

  let tips = markdownPane.insertAdjacentElement('afterbegin',$("<ul></ul>"))!
  editor.closest("form")!.addEventListener("submit", (_event) => {
    tips.innerHTML=""
    if (editor._tipTimer) {
      clearTimeout(editor._tipTimer)
      editor._tipTimer = null
    }
  })
  editor.addEventListener("keyup", (_event) => {
    if (editor._tipTimer)
      return

    // we only fire every 500ms, should be responsive enough
    editor._tipTimer = setTimeout(() => {
      editor._tipTimer = null
      let text = new ContentParser(editor.value).textualContent()
      tips.innerHTML=""
      for (let rule of TIPS) {
        let matcher = new SimpleMatcher(rule)
        matcher.check(text)
        matcher.tips().forEach((suggestion) => {
          tips.appendChild($(`<li>${suggestion}</li>`))
        })
      }
    },500)
  })
}

