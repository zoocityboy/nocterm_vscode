import * as vscode from 'vscode';
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
  if (!input) { return 'Name cannot be empty'; }
  if (!/^[a-z_]\w*$/.test(input)) { return 'Must be a valid Dart identifier'; }
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
  if (!name) { return; }

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
  if (!name) { return; }

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

async function checkNoctermBlocDependency(): Promise<boolean> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) { return false; }

  for (const folder of folders) {
    const pubspecUri = vscode.Uri.joinPath(folder.uri, 'pubspec.yaml');
    try {
      const content = await vscode.workspace.fs.readFile(pubspecUri);
      const text = Buffer.from(content).toString('utf-8');
      if (text.includes('nocterm_bloc')) { return true; }
    } catch {
      // no pubspec.yaml in this folder, skip
    }
  }
  return false;
}

export async function activate(context: vscode.ExtensionContext) {
  const hasDep = await checkNoctermBlocDependency();
  vscode.commands.executeCommand('setContext', 'nocterm:hasNoctermBloc', hasDep);

  const watcher = vscode.workspace.createFileSystemWatcher('**/pubspec.yaml');
  watcher.onDidChange(async () => {
    const dep = await checkNoctermBlocDependency();
    vscode.commands.executeCommand('setContext', 'nocterm:hasNoctermBloc', dep);
  });
  watcher.onDidCreate(async () => {
    const dep = await checkNoctermBlocDependency();
    vscode.commands.executeCommand('setContext', 'nocterm:hasNoctermBloc', dep);
  });
  watcher.onDidDelete(async () => {
    const dep = await checkNoctermBlocDependency();
    vscode.commands.executeCommand('setContext', 'nocterm:hasNoctermBloc', dep);
  });
  context.subscriptions.push(watcher);

  context.subscriptions.push(
    vscode.commands.registerCommand('nocterm.newBloc', generateBloc),
    vscode.commands.registerCommand('nocterm.newCubit', generateCubit),
  );
}

export function deactivate() {}
