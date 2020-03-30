# Exercism Plus

Exercism Plus is a small Chrome Extension to add additional mentoring functionality to the
already amazing [Exercism.io](https://exercism.io/) service.

## What does it do?

- Adds "New solutions" link to the site menu (my workflow is heavy on this and the New Activity view)
- Adds &#8984;-B and &#8984;-I shortcuts for bold and italic to the response editor for Mac
- Adds a textual analysis engine to the text editor to help prevent common anti-patterns

## TODO

- [ ] More textual analysis anti-patterns
- [ ] Real build engine to make codebase modular (rollup)
- Configurable/custom textual analysis?
- Configuration page?

## Textual Analysis Engine

### What it looks like

![Textual analysis example](https://raw.githubusercontent.com/yyyc514/exercism_plus/master/sample/snap.png)

### How it works

Your response text is first stripped of code blocks and then analyzed with regular
expressions. If a given regular expression matches then the corresponding tip
will be shown. Programmatic matchers can also be written that do textual analysis with
Javascript rather than regular expression, for more flexibility.

## Getting the Extension

Currently just download it from Git and install it in Chrome Developer Mode.

## Contributing

Please only an issue if you have any idea for contributing.  If you mentor and have a common
anti-pattern to share, please feel free to open a PR.

## License

Exercism Plus is released under the MIT License. See [LICENSE](https://github.com/yyyc514/exercism_plus/blob/master/LICENSE) file for details.