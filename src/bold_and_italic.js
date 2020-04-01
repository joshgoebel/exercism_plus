import { getEditor } from "./editor"
export const fixEditorKeystrokes = () => {
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
