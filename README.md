# Clamp It! VS Code Extension

![clamp-it](https://github.com/user-attachments/assets/f987b3b2-68bd-4b24-8372-f610f8e4b41f)

**Clamp It!** is a Visual Studio Code extension that helps web developers easily generate CSS `clamp()` function for responsive font sizing. This extension allows you to specify a base font size, mobile font size, desktop font size, and viewport sizes, automatically calculating the appropriate `clamp()` function in rem units.

## Features

- **Responsive Font Sizes**: Generate `clamp()` functions based on specified font sizes and viewport widths.

- **Custom and Global Settings**: Set base font sizes and viewport limits either globally or per project.

- **Easy Integration**: Quickly replace selected text in your code with the generated `clamp()` function.

- **Comment Control**: Optionally include comments with the minimum and maximum values in the generated clamp() function. This feature can be enabled or disabled globally.

## Installation


Search for **"Clamp It!"** in the Extensions view (Ctrl + Shift + X or Cmd + Shift + X) and install it from the Marketplace.

## Usage

1. **Select Text**: Highlight the text in the format `mobileFontSize`, `desktopFontSize`, `baseFontSize`, `viewportMin`, and `viewportMax`.

    Example:
    ```
    16, 20, 16, 600, 1200
    ```

2. **Command Palette**: Open the command palette (Ctrl + Shift + P or Cmd + Shift + P), and type **"Clamp it!"** to execute the command.

3. **Output**: The selected text will be replaced with a formatted `clamp()` function.

    Example output:

    ```css
    clamp(1rem, calc(0.821rem + 0.476vw), 1.25rem)
    ```

    If the setting is enabled, the output will also include a comment:

    ```css
    clamp(1rem, calc(0.821rem + 0.476vw), 1.25rem); /* min: 16px, max: 20px */
    ```
## Settings

### Global Settings

- `clampExtension.globalMinViewport`: Set the global minimum viewport size (default: 600).

- `clampExtension.globalMaxViewport`: Set the global maximum viewport size (default: 1200).

- `clampExtension.baseFontSize`: Set the global base font size (default: 16).

- `clampExtension.showComments`: Show comments with min and max values in the generated clamp() function (default: false).

### Local Project Settings

You can override the global settings for individual projects by adding them to your project's `.vscode/settings.json` file:

```
{
  "clampExtension.globalMinViewport": 500,
  "clampExtension.globalMaxViewport": 1500,
  "clampExtension.baseFontSize": 14,
  "clampExtension.showComments": true
}
```

## Development

To contribute to the development of this extension:

1. **Clone the repository**:

```
git clone https://github.com/yourusername/clamp-it.git

cd clamp-it
```

1. **Install dependencies**:

```
npm install
```

2. **Run the extension**:

Open the project in VS Code and press F5 to launch the extension in a new VS Code window.

## ToDo

Figure out tests! o_O

---

> Built with assistance of ChatGPT. ¯\\_(ツ)_/¯
