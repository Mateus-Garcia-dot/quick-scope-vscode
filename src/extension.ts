import * as vscode from 'vscode';
import { handleLineChangeEvent } from './change_line_event';

export function activate(context: vscode.ExtensionContext) {
    const cursorChangeListener = vscode.window.onDidChangeTextEditorSelection((event) => {
        handleLineChangeEvent(event.textEditor);
    });

    context.subscriptions.push(cursorChangeListener);
}



export function deactivate() {}
