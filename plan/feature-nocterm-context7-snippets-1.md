---
goal: Create a TypeScript VS Code extension that provides n-prefixed Nocterm snippets for mcp_context7_query-docs workflows
version: 1.0
date_created: 2026-02-21
last_updated: 2026-02-21
owner: zoocityboy
status: 'Completed'
tags: [feature, vscode-extension, snippets, nocterm, context7]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This implementation plan defines and records the deterministic steps used to scaffold a new TypeScript VS Code extension with the official CLI and implement n-prefixed snippets for Nocterm usage of mcp_context7_query-docs.

## 1. Requirements & Constraints

- **REQ-001**: Scaffold the extension using the standard VS Code extension CLI (`yo code`) in TypeScript mode.
- **REQ-002**: Implement snippet contributions that support Nocterm workflows for `mcp_context7_query-docs`.
- **REQ-003**: Ensure snippet prefixes are `n`-prefixed instead of Flutter-style `f` prefixes.
- **REQ-004**: Keep the implementation self-contained in the generated extension workspace.
- **CON-001**: Do not copy code from Dart-Code directly.
- **CON-002**: Keep changes minimal and focused on snippet extension behavior.
- **GUD-001**: Use deterministic file paths and explicit contribution points in `package.json`.
- **PAT-001**: Follow VS Code extension scaffold conventions from generator-code.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Generate a TypeScript extension skeleton using the official CLI and establish base metadata.

| Task | Description | Completed | Date |
| ------ | ------------- | ----------- | ------ |
| TASK-001 | Execute `npx --yes --package yo --package generator-code -- yo code . --extensionType ts --quick` in workspace root | ✅ | 2026-02-21 |
| TASK-002 | Verify scaffolded files (`package.json`, `src/extension.ts`, configs, docs) are present | ✅ | 2026-02-21 |
| TASK-003 | Update extension metadata (`displayName`, `description`, `categories`, `keywords`) for snippet purpose | ✅ | 2026-02-21 |

### Implementation Phase 2

- GOAL-002: Implement `n`-prefixed snippet contribution and align documentation.

| Task | Description | Completed | Date |
| ------ | ------------- | ----------- | ------ |
| TASK-004 | Add `contributes.snippets` entries in `package.json` for `plaintext` and `markdown` | ✅ | 2026-02-21 |
| TASK-005 | Create `snippets/nocterm.code-snippets` with `n`-prefixed templates for query and resolve/query flows | ✅ | 2026-02-21 |
| TASK-006 | Replace README scaffold text with extension-specific usage and release notes | ✅ | 2026-02-21 |

### Implementation Phase 3

- GOAL-003: Validate build/lint behavior for the modified extension.

| Task | Description | Completed | Date |
| ------ | ------------- | ----------- | ------ |
| TASK-007 | Run project lint/build scripts to confirm no TypeScript/package regressions from snippet changes | ✅ | 2026-02-21 |
| TASK-008 | Keep runtime activation code minimal and consistent with snippet-focused extension | ✅ | 2026-02-21 |
| TASK-009 | Confirm file inventory and plan completion status | ✅ | 2026-02-21 |

## 3. Alternatives

- **ALT-001**: Create a snippet-only extension template directly (`extensionType snippets`) was rejected to satisfy the explicit TypeScript extension requirement.
- **ALT-002**: Keep default command-based Hello World contribution was rejected as unrelated UX not requested.

## 4. Dependencies

- **DEP-001**: Node.js and npm for CLI scaffolding and scripts.
- **DEP-002**: `yo` + `generator-code` invoked via `npx`.
- **DEP-003**: VS Code extension runtime and TypeScript toolchain from scaffolded `devDependencies`.

## 5. Files

- **FILE-001**: `package.json` – extension metadata and snippet contribution registration.
- **FILE-002**: `src/extension.ts` – minimal TypeScript activation entrypoint.
- **FILE-003**: `snippets/nocterm.code-snippets` – snippet definitions and bodies.
- **FILE-004**: `README.md` – user-facing extension documentation.
- **FILE-005**: `plan/feature-nocterm-context7-snippets-1.md` – implementation plan record.

## 6. Testing

- **TEST-001**: Run `npm run lint` and ensure script completes without new errors.
- **TEST-002**: Confirm snippets appear in Markdown/plaintext IntelliSense using `n`-prefixed triggers.

## 7. Risks & Assumptions

- **RISK-001**: Broad `n` prefix may be noisy in IntelliSense; mitigated by additional specific prefixes (`nq`, `nrq`, `nimpl`).
- **RISK-002**: Generator behavior can vary by Node/npm version; mitigated by explicit CLI flags.
- **ASSUMPTION-001**: Target users write prompts in plaintext or markdown files.
- **ASSUMPTION-002**: No direct runtime commands are required for this snippet-first MVP.

## 8. Related Specifications / Further Reading

- [VS Code: Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)
- [npm: generator-code](https://www.npmjs.com/package/generator-code)
- [VS Code Snippet Guide](https://code.visualstudio.com/api/language-extensions/snippet-guide)
