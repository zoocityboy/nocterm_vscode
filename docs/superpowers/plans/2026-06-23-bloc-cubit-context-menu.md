# BLoC/Cubit Context Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add right-click context menu items in VS Code explorer to scaffold BLoC (3 files) and Cubit (2 files) using `nocterm_bloc` conventions with `part` directives.

**Architecture:** Two VS Code commands registered in `package.json` under `contributes.commands` and `contributes.menus`, implemented in `src/extension.ts`. Commands prompt for a name, validate it, and write template files to the selected folder.

**Tech Stack:** VS Code Extension API (TypeScript), `vscode.Uri`, `workspace.fs`, `window.showInputBox`

---

### Task 1: Update package.json with commands and menu contributions

**Files:**
- Modify: `package.json` (lines 31-43)

- [x] **Step 1: Add commands, menus, and activationEvents**

Replace the existing `"activationEvents"` and `"contributes"` sections:

```json
"activationEvents": [
  "onCommand:nocterm.newBloc",
  "onCommand:nocterm.newCubit"
],
"main": "./out/extension.js",
"contributes": {
  "commands": [
    {
      "command": "nocterm.newBloc",
      "title": "Nocterm: New BLoC"
    },
    {
      "command": "nocterm.newCubit",
      "title": "Nocterm: New Cubit"
    }
  ],
  "menus": {
    "explorer/context": [
      {
        "command": "nocterm.newBloc",
        "when": "explorerResourceIsFolder",
        "group": "2_nocterm"
      },
      {
        "command": "nocterm.newCubit",
        "when": "explorerResourceIsFolder",
        "group": "2_nocterm"
      }
    ]
  },
  "snippets": [
    {
      "language": "dart",
      "path": "./snippets/nocterm.code-snippets"
    }
  ]
}
```

- [x] **Step 2: Verify the JSON is valid**

Run: `python3 -c "import json; f=open('package.json'); json.load(f); print('OK')"`
Expected: `OK`

- [x] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add nocterm.newBloc/newCubit commands and explorer context menus"
```

---

### Task 2: Rewrite extension.ts with BLoC/Cubit generation logic

**Files:**
- Modify: `src/extension.ts` (full rewrite)

- [x] **Step 1: Write helper functions**

Add these helpers before `activate`:

```typescript
import * as path from 'path';

function toPascalCase(str: string): string {
  return str
    .split(/[_\s]/)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('');
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[_\s]+/g, '_');
}

function validateDartIdentifier(input: string): string | null {
  if (!input) return 'Name cannot be empty';
  if (!/^[a-z_]\w*$/.test(input)) return 'Must be a valid Dart identifier';
  return null;
}

async function writeAllFiles(
  folder: string,
  files: Record<string, string>,
): Promise<boolean> {
  for (const fileName of Object.keys(files)) {
    const fileUri = vscode.Uri.file(path.join(folder, fileName));
    try {
      await vscode.workspace.fs.stat(fileUri);
      vscode.window.showWarningMessage(`File already exists: ${fileName}`);
      return false;
    } catch {
      // file does not exist, proceed
    }
  }
  for (const [fileName, content] of Object.entries(files)) {
    const fileUri = vscode.Uri.file(path.join(folder, fileName));
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf-8'));
  }
  return true;
}
```

- [x] **Step 2: Write generateBloc function**

```typescript
async function generateBloc(folderUri?: vscode.Uri) {
  const uri = folderUri ?? vscode.workspace.workspaceFolders?.[0]?.uri;
  if (!uri) {
    vscode.window.showErrorMessage('No folder selected and no workspace folder open');
    return;
  }

  const name = await vscode.window.showInputBox({
    prompt: 'Enter BLoC name (e.g., counter)',
    placeHolder: 'counter',
    validateInput: validateDartIdentifier,
  });
  if (!name) return;

  const p = toPascalCase(name);
  const f = toSnakeCase(name);
  const folder = uri.fsPath;

  const files: Record<string, string> = {
    [`${f}_bloc.dart`]:
      `import 'package:nocterm_bloc/nocterm_bloc.dart';\n` +
      `\n` +
      `part '${f}_event.dart';\n` +
      `part '${f}_state.dart';\n` +
      `\n` +
      `class ${p}Bloc extends Bloc<${p}Event, ${p}State> {\n` +
      `  ${p}Bloc() : super(const ${p}Initial()) {\n` +
      `    on<${p}Event>(_on${p}Event);\n` +
      `  }\n` +
      `\n` +
      `  FutureOr<void> _on${p}Event(\n` +
      `    ${p}Event event,\n` +
      `    Emitter<${p}State> emit,\n` +
      `  ) {\n` +
      `    // TODO: implement handler\n` +
      `  }\n` +
      `}\n`,
    [`${f}_event.dart`]:
      `part of '${f}_bloc.dart';\n` +
      `\n` +
      `sealed class ${p}Event {}\n` +
      `\n` +
      `class ${p}Started extends ${p}Event {}\n`,
    [`${f}_state.dart`]:
      `part of '${f}_bloc.dart';\n` +
      `\n` +
      `sealed class ${p}State {\n` +
      `  const ${p}State();\n` +
      `}\n` +
      `\n` +
      `class ${p}Initial extends ${p}State {\n` +
      `  const ${p}Initial();\n` +
      `}\n`,
  };

  await writeAllFiles(folder, files);
}
```

- [x] **Step 3: Write generateCubit function**

```typescript
async function generateCubit(folderUri?: vscode.Uri) {
  const uri = folderUri ?? vscode.workspace.workspaceFolders?.[0]?.uri;
  if (!uri) {
    vscode.window.showErrorMessage('No folder selected and no workspace folder open');
    return;
  }

  const name = await vscode.window.showInputBox({
    prompt: 'Enter Cubit name (e.g., counter)',
    placeHolder: 'counter',
    validateInput: validateDartIdentifier,
  });
  if (!name) return;

  const p = toPascalCase(name);
  const f = toSnakeCase(name);
  const folder = uri.fsPath;

  const files: Record<string, string> = {
    [`${f}_cubit.dart`]:
      `import 'package:nocterm_bloc/nocterm_bloc.dart';\n` +
      `\n` +
      `part '${f}_state.dart';\n` +
      `\n` +
      `class ${p}Cubit extends Cubit<${p}State> {\n` +
      `  ${p}Cubit() : super(const ${p}Initial());\n` +
      `}\n`,
    [`${f}_state.dart`]:
      `part of '${f}_cubit.dart';\n` +
      `\n` +
      `sealed class ${p}State {\n` +
      `  const ${p}State();\n` +
      `}\n` +
      `\n` +
      `class ${p}Initial extends ${p}State {\n` +
      `  const ${p}Initial();\n` +
      `}\n`,
  };

  await writeAllFiles(folder, files);
}
```

- [x] **Step 4: Wire activate function**

Replace the existing stub:

```typescript
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('nocterm.newBloc', generateBloc),
    vscode.commands.registerCommand('nocterm.newCubit', generateCubit),
  );
}

export function deactivate() {}
```

- [x] **Step 5: Compile to make sure it builds**

Run: `npm run compile`
Expected: No errors, `out/extension.js` is created

- [x] **Step 6: Lint**

Run: `npm run lint`
Expected: No errors

- [x] **Step 7: Commit**

```bash
git add src/extension.ts
git commit -m "feat: implement BLoC/Cubit file generation commands"
```

---

### Self-Review

**Spec coverage:**
- Context menu contributions ✓ (Task 1)
- Command registration ✓ (Task 2, Step 4)
- BLoC: 3 files, part directives, CounterBloc/CounterEvent/CounterState ✓ (Task 2, Step 2)
- Cubit: 2 files, part directives, CounterCubit/CounterState ✓ (Task 2, Step 3)
- Name validation ✓ (Task 2, Step 1 - validateDartIdentifier)
- File conflict detection ✓ (Task 2, Step 1 - writeAllFiles)
- Workspace fallback ✓ (Task 2, Step 2 - folderUri fallback)

**Placeholder scan:** No TBDs, TODOs, or vague steps. Every code block is complete.

**Type consistency:** `generateBloc` and `generateCubit` both accept `vscode.Uri | undefined`, both return `Promise<void>`, both use `writeAllFiles` which returns `Promise<boolean>` and accepts `(string, Record<string, string>)`. All consistent.
