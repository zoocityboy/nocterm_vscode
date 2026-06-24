# Context Menu: New BLoC / New Cubit for nocterm_bloc

## Goal

Add right-click context menu items in the VS Code file explorer to scaffold BLoC (3 files, `part of`) and Cubit (2 files, `part of`) boilerplate using `nocterm_bloc` conventions.

## Approach

Custom VS Code commands (`nocterm.newBloc`, `nocterm.newCubit`) contributed via `package.json`, wired into the explorer folder context menu. When invoked, prompt for the feature name, then generate files in the selected directory.

## No new dependencies

All logic lives in `src/extension.ts` using only the `vscode` API (`window.showInputBox`, `workspace.fs.writeFile`, `Uri`).

## Contributions (package.json)

```json
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
  "activationEvents": [
    "onCommand:nocterm.newBloc",
    "onCommand:nocterm.newCubit"
  ]
}
```

## Command flow

1. User right-clicks a folder in the explorer
2. Selects "Nocterm: New BLoC" or "Nocterm: New Cubit"
3. Input box appears: "Enter BLoC name (e.g., counter)"
4. Name is validated (must be a valid Dart identifier, lowerCamelCase)
5. Files are created in the selected folder using `workspace.fs.writeFile`
6. If any file already exists, a warning notification is shown and generation is skipped

## BLoC templates

Input `counter` → 3 files in the selected folder:

### counter_bloc.dart

```dart
import 'package:nocterm_bloc/nocterm_bloc.dart';

part 'counter_event.dart';
part 'counter_state.dart';

class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(const CounterInitial()) {
    on<CounterEvent>(_onCounterEvent);
  }

  FutureOr<void> _onCounterEvent(
    CounterEvent event,
    Emitter<CounterState> emit,
  ) {
    // TODO: implement handler
  }
}
```

### counter_event.dart

```dart
part of 'counter_bloc.dart';

sealed class CounterEvent {}

class CounterStarted extends CounterEvent {}
```

### counter_state.dart

```dart
part of 'counter_bloc.dart';

sealed class CounterState {
  const CounterState();
}

class CounterInitial extends CounterState {
  const CounterInitial();
}
```

## Cubit templates

Input `counter` → 2 files in the selected folder:

### counter_cubit.dart

```dart
import 'package:nocterm_bloc/nocterm_bloc.dart';

part 'counter_state.dart';

class CounterCubit extends Cubit<CounterState> {
  CounterCubit() : super(const CounterInitial());
}
```

### counter_state.dart

```dart
part of 'counter_cubit.dart';

sealed class CounterState {
  const CounterState();
}

class CounterInitial extends CounterState {
  const CounterInitial();
}
```

## Implementation

Single helper functions in `src/extension.ts`:
- `generateBlocFiles(context, folderUri)` — validates name, writes 3 files
- `generateCubitFiles(context, folderUri)` — validates name, writes 2 files
- `toPascalCase(name)` — converts input to PascalCase for class names
- `toFileName(name)` — converts input to snake_case for file names

## Error handling

- Empty name → show error message, abort
- Invalid Dart identifier → show error message, abort
- File already exists → show warning with existing file path, abort
- Workspace not writable → VS Code shows its own error

## Future considerations

- Adding `part` directives automatically to the main file
- Custom event/state names beyond the default sealed class
