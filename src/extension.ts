import * as path from "path";
import * as vscode from "vscode";

export function toPascalCase(str: string): string {
	// Insert underscore before uppercase letters that follow lowercase (camelCase → snake_case)
	let normalized = str.replace(/([a-z])([A-Z])/g, "$1_$2");
	return normalized
		.split(/[_\s]+/)
		.filter(Boolean)
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join("");
}

export function toSnakeCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, "$1_$2") // camelCase boundary
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2") // acronym boundary (e.g. HTTPServer → HTTP_Server)
		.toLowerCase()
		.replace(/^_/, "")
		.replace(/[_\s]+/g, "_");
}

export function validateInput(input: string): string | null {
	if (!input || !input.trim()) {
		return "Name cannot be empty";
	}
	// Reject characters that are invalid in file/class names
	if (/[<>:"/\\|?*\x00-\x1f]/.test(input)) {
		return "Name contains invalid characters";
	}
	return null;
}

async function writeAllFiles(
	folder: string,
	files: Record<string, string>,
): Promise<boolean> {
	// Check for existing files first
	const existingFiles: string[] = [];
	for (const fileName of Object.keys(files)) {
		const fileUri = vscode.Uri.file(path.join(folder, fileName));
		try {
			await vscode.workspace.fs.stat(fileUri);
			existingFiles.push(fileName);
		} catch {
			// file does not exist, proceed
		}
	}
	if (existingFiles.length > 0) {
		vscode.window.showWarningMessage(
			`Cannot generate: file(s) already exist — ${existingFiles.join(", ")}`,
		);
		return false;
	}

	// Write all files with error handling
	let hadError = false;
	for (const [fileName, content] of Object.entries(files)) {
		try {
			const fileUri = vscode.Uri.file(path.join(folder, fileName));
			await vscode.workspace.fs.writeFile(
				fileUri,
				Buffer.from(content, "utf-8"),
			);
		} catch (err) {
			console.error(`Failed to write ${fileName}:`, err);
			hadError = true;
		}
	}
	if (hadError) {
		vscode.window.showErrorMessage(
			"Failed to generate some files. Check output for details.",
		);
		return false;
	}
	return true;
}

async function hasNoctermBlocDep(): Promise<boolean> {
	const pubspecs = await vscode.workspace.findFiles(
		"**/pubspec.yaml",
		"**/node_modules/**",
		20,
	);
	for (const uri of pubspecs) {
		try {
			const content = await vscode.workspace.fs.readFile(uri);
			const text = Buffer.from(content).toString("utf-8");
			if (/nocterm_bloc/.test(text)) {
				return true;
			}
		} catch {
			// skip unreadable
		}
	}
	return false;
}

async function generateBloc(folderUri?: vscode.Uri) {
	if (!(await hasNoctermBlocDep())) {
		vscode.window.showErrorMessage(
			"This project does not depend on nocterm_bloc",
		);
		return;
	}

	const uri = folderUri ?? vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!uri) {
		vscode.window.showErrorMessage(
			"No folder selected and no workspace folder open",
		);
		return;
	}

	const name = await vscode.window.showInputBox({
		prompt: "Enter BLoC name (e.g., My Customer)",
		placeHolder: "My Customer",
		validateInput: validateInput,
	});
	if (!name) {
		return;
	}

	const p = toPascalCase(name);
	const f = toSnakeCase(p);
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
			`  Future<void> _on${p}Event(\n` +
			`    ${p}Event event,\n` +
			`    Emitter<${p}State> emit,\n` +
			`  ) async {\n` +
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

	const success = await writeAllFiles(folder, files);
	if (success) {
		vscode.window.showInformationMessage(
			`Generated BLoC '${p}' in ${path.basename(folder)}/`,
		);
		// Refresh Explorer so newly created files appear immediately
		await vscode.commands.executeCommand("workbench.files.action.refreshFiles");
		// Open the main bloc file for immediate editing
		const mainFileUri = vscode.Uri.file(path.join(folder, `${f}_bloc.dart`));
		try {
			await vscode.workspace.fs.stat(mainFileUri);
			await vscode.window.showTextDocument(mainFileUri);
		} catch {
			// file might not exist yet or other error — ignore
		}
	}
}

async function generateCubit(folderUri?: vscode.Uri) {
	if (!(await hasNoctermBlocDep())) {
		vscode.window.showErrorMessage(
			"This project does not depend on nocterm_bloc",
		);
		return;
	}

	const uri = folderUri ?? vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!uri) {
		vscode.window.showErrorMessage(
			"No folder selected and no workspace folder open",
		);
		return;
	}

	const name = await vscode.window.showInputBox({
		prompt: "Enter Cubit name (e.g., My Customer)",
		placeHolder: "My Customer",
		validateInput: validateInput,
	});
	if (!name) {
		return;
	}

	const p = toPascalCase(name);
	const f = toSnakeCase(p);
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

	const success = await writeAllFiles(folder, files);
	if (success) {
		vscode.window.showInformationMessage(
			`Generated Cubit '${p}' in ${path.basename(folder)}/`,
		);
		// Refresh Explorer so newly created files appear immediately
		await vscode.commands.executeCommand("workbench.files.action.refreshFiles");
		// Open the main cubit file for immediate editing
		const mainFileUri = vscode.Uri.file(path.join(folder, `${f}_cubit.dart`));
		try {
			await vscode.workspace.fs.stat(mainFileUri);
			await vscode.window.showTextDocument(mainFileUri);
		} catch {
			// file might not exist yet or other error — ignore
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("nocterm.newBloc", generateBloc),
		vscode.commands.registerCommand("nocterm.newCubit", generateCubit),
	);
}

export function deactivate() {}
