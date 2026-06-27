# Nocterm

Type-safe VS Code snippets for building Nocterm UI components in Dart.

[![CI](https://github.com/zoocityboy/nocterm_vscode/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/zoocityboy/nocterm_vscode/actions/workflows/ci-vscode-extension.yml)
![Coverage](https://img.shields.io/badge/coverage-pending-lightgrey?style=flat-square)
![Version](https://img.shields.io/badge/version-0.0.3-6f42c1?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
[![License](https://img.shields.io/github/license/zoocityboy/nocterm_vscode?style=flat-square)](LICENSE)

[Features](#features) • [Install](#install) • [Usage](#usage) • [Snippet Reference](#snippet-reference) • [Development](#development)

[Releases](https://github.com/zoocityboy/nocterm_vscode/releases) • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zoocityboy.nocterm-dev)

## Features

- Focused snippets for common Nocterm component patterns.
- Fast `n`-prefixed completions in Dart files.
- **nocterm_hooks support** — `useState`, `useEffect`, `useMemoized`, and more with `nh` prefixes.
- **Right-click BLoC/Cubit scaffolding** — generate BLoC (3 files) or Cubit (2 files) from the VS Code explorer context menu.

> [!NOTE]
> The coverage badge is marked as pending until coverage reporting is wired into CI.

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

### Snippets

1. Open a `.dart` file.
2. Type one of the snippet prefixes (for example `nstless`).
3. Select the snippet from IntelliSense.
4. Fill in placeholders and tab through editable fields.

### BLoC / Cubit Scaffolding

Right-click a folder in the VS Code explorer and select **Nocterm: New BLoC** or **Nocterm: New Cubit**. Enter a name (e.g. `counter`) and the extension generates the file set with `part` directives:

| Command | Files Generated |
| --- | --- |
| `Nocterm: New BLoC` | `{name}_bloc.dart`, `{name}_event.dart`, `{name}_state.dart` |
| `Nocterm: New Cubit` | `{name}_cubit.dart`, `{name}_state.dart` |

The generated code uses [nocterm_bloc](https://pub.dev/packages/nocterm_bloc) conventions with sealed state classes and `part`-based file splitting.

## Snippet Reference

### Component Templates

| Prefix | Description |
| --- | --- |
| `nstless` | Insert a `StatelessComponent` template |
| `nstful` | Insert a `StatefulComponent` template |
| `nstanim` | Insert a `StatefulComponent` with `AnimationController` |

### nocterm_hooks

requires [nocterm_hooks](package:nocterm_hooks/nocterm_hooks.dart)

| Prefix | Hook | Description |
| --- | --- | --- |
| `nhook` | — | Full `HookComponent` template with imports, useState, useEffect, useMemoized |
| `nhusestate` | `useState<T>` | Reactive `ValueNotifier<T>` — read `.value`, set to rebuild |
| `nhuseeffect` | `useEffect` | Side effect with optional `[keys]` and cleanup return |
| `nhusememoized` | `useMemoized<T>` | Cached value, recomputed only when keys change |
| `nhuseref` | `useRef<T>` | Mutable reference surviving rebuilds without triggering them |
| `nhuseismounted` | `useIsMounted()` | Guard for async continuations after await |
| `nhusecallback` | `useCallback<T>` | Memoized function reference, stable across builds |
| `nhuselistenable` | `useListenable<L>` | Subscribe to any `Listenable`/`ChangeNotifier` |
| `nhusevaluelistenable` | `useValueListenable<T>` | Subscribe + return current `.value` in one call |

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
> Snippets are triggered via `n`-prefixed completions in Dart files. BLoC/Cubit scaffolding is available through the explorer context menu or Command Palette (`Nocterm: New BLoC`, `Nocterm: New Cubit`).
