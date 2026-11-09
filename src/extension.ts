import * as vscode from 'vscode';
import { generateClampFunction, parseInput } from './clamp';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.clampIt', clampIt),
  );
}

async function clampIt(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const config = vscode.workspace.getConfiguration('clampExtension', editor.document.uri);
  const defaults = {
    viewportMin: config.get<number>('globalMinViewport', 600),
    viewportMax: config.get<number>('globalMaxViewport', 1200),
    baseFontSize: config.get<number>('baseFontSize', 16),
  };
  const showComments = config.get<boolean>('showComments', true);

  const edits: Array<{ range: vscode.Range; text: string }> = [];
  const errors: string[] = [];

  for (const selection of editor.selections) {
    const result = parseInput(editor.document.getText(selection), defaults);
    if (typeof result === 'string') {
      errors.push(result);
    } else {
      edits.push({ range: selection, text: generateClampFunction(result, showComments) });
    }
  }

  if (edits.length > 0) {
    await editor.edit((builder) => {
      for (const edit of edits) {
        builder.replace(edit.range, edit.text);
      }
    });
  }

  if (errors.length > 0) {
    vscode.window.showErrorMessage(
      `Clamp it! ${errors[0]} Format: mobileFontSize, desktopFontSize, viewportMin, viewportMax, baseFontSize.`,
    );
  }
}

export function deactivate() {}
