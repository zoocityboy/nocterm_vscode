# Nocterm Dev

Type-safe VS Code snippets for building Nocterm UI components in Dart.

![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.109.0-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)
![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Version](https://img.shields.io/badge/version-0.0.1-6f42c1?style=flat-square)

[Features](#features) • [Install](#install) • [Usage](#usage) • [Snippet Reference](#snippet-reference) • [Development](#development)

## Features

- Focused snippets for common Nocterm component patterns.
- Fast `n`-prefixed completions in Dart files.
- Minimal extension runtime (no commands, no settings).

> [!IMPORTANT]
> This extension currently contributes snippets for `dart` files only.

## Install

### From source (this repository)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Compile the extension:

   ```bash
   npm run compile
   ```

3. Press `F5` in VS Code to launch an Extension Development Host.

> [!TIP]
> The extension depends on the Dart extension: `Dart-Code.dart-code`.

## Usage

1. Open a `.dart` file.
2. Type one of the snippet prefixes (for example `nstless`).
3. Select the snippet from IntelliSense.
4. Fill in placeholders and tab through editable fields.

## Snippet Reference

| Prefix | Description |
| --- | --- |
| `nstless` | Insert a `StatelessComponent` template |
| `nstful` | Insert a `StatefulComponent` template |
| `nstanim` | Insert a `StatefulComponent` with `AnimationController` |

## Development

### Scripts

```bash
npm run compile   # Build TypeScript
npm run watch     # Watch mode
npm run lint      # Lint source
npm test          # Run extension tests
```

### Project Structure

- `snippets/nocterm.code-snippets`: Snippet definitions and bodies.
- `src/extension.ts`: Extension entrypoint.
- `src/test/`: Extension test files.

## Notes

> [!NOTE]
> This project is snippet-driven: there are no commands to run from the Command Palette, and no custom settings required.
