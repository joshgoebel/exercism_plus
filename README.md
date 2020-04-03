# Exercism Plus Chrome Extension

Exercism Plus is a small Chrome Extension to add additional mentoring functionality to the
already amazing [Exercism.io](https://exercism.io/) service.

This is mostly for mentors, you probably won't get a lot out of it as a student.

## Features

- Thoughtful UI tweaks and subtle design cleanups (less bold everywhere, a bit softer, etc.)
- Some accessibility and contrast improvements throughout
- <a href="#inline-student-profiles">Inline student profiles</a> to provide context for who you are mentoring
- <a href="#keybindings">Keybindings</a> for common tasks
- <a href="#textual-analysis-engine">Textual analysis engine</a> - to help prevent common mentoring anti-patterns
- <a href="#popout-editor">Pop-out editor</a> - for commenting on lengthy solutions with a lot of code
- Add a "Queue" (New solutions) link to the site menu (my workflow is heavy on this and the Notifications view)

### Subtle usability improvements

- Solutions become sticky when scrolling a long discussion - so that you can always see the source (provided it fits in your browsers vertical space)
- Added double-wide viewing mode that removes `max-width` and set up a 60/40 split view

### Keybindings

- `n` Queue (Next solutions)
- `;` Notifications
- `w` Toggle double-wide viewing mode for discussions
- `/` Toggle the pop-out editor for discussions
- - Adds &#8984;B and &#8984;I keybindings for Bold and Italic to the editor on Macs

### Popout Editor

<img src="https://raw.githubusercontent.com/yyyc514/exercism_plus/master/sample/popout_editor.png" width="500" />

### Inline Student Profiles

<img src="https://raw.githubusercontent.com/yyyc514/exercism_plus/master/sample/who_profile.png" width="500" />

### Textual Analysis Engine

![Textual analysis example](https://raw.githubusercontent.com/yyyc514/exercism_plus/master/sample/snap.png)

#### How it works

Your response text is first stripped of code blocks and then analyzed with regular
expressions. If a given regular expression matches then the corresponding tip
will be shown. Programmatic matchers can also be written that do textual analysis with
Javascript rather than regular expression, for more flexibility.

## TODO

- [ ] More textual analysis anti-patterns
- Configurable/custom textual analysis?
- Configuration page?

## Getting the Extension

- Fetch the whole repository from Git and load the unpacked extension in Developer mode (best if you are planning on contributing)
- Download and install the [extension.crx](https://github.com/yyyc514/exercism_plus/raw/master/extension.crx) file from the GitHub repository
- Install the extension directly from the [Chrome Web Store](https://chrome.google.com/webstore/detail/exercism-plus/mpbkfakldcnnihdkfkhkpfijjaoglcah)

## Contributing

Please open an issue if you have any idea for contributing.  If you mentor and have a common
anti-pattern to share, please feel free to open a PR.

### For developers

```bash
npm install -g rollup
rollup -c -w
```
Then edit some code. `rollup` will refresh the ./extension directory, and you can reload the extension in your browser.

## License

Exercism Plus is released under the MIT License. See [LICENSE](https://github.com/yyyc514/exercism_plus/blob/master/LICENSE) file for details.
