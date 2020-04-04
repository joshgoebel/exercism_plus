const click = (el) => {
  let event = new MouseEvent('click', { bubbles: true});
  el.dispatchEvent(event);
}

export const fixEditorKeystrokes = () => {
    let editors = document.querySelectorAll('textarea[name="discussion_post[content]"]')

    editors.forEach((editor) => {
      if (editor._fixedKeystrokes) return;
      editor._fixedKeystrokes = true

      editor.addEventListener("keydown", (event) => {
        if (event.metaKey && event.key=="b") {
          let boldButton = editor.parentNode.querySelector('button[data-hotkey="Ctrl+B"]')
          click(boldButton);
        }
        if (event.metaKey && event.key=="i") {
          let italicButton = editor.parentNode.querySelector('button[data-hotkey="Ctrl+I"]')
          click(italicButton);
        }
      })
    })

  }
