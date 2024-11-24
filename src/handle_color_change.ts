import * as vscode from 'vscode';

let activeDecorations: vscode.TextEditorDecorationType[] = [];

export function applyTextColor( editor: vscode.TextEditor, line: number, character: number, color: string): void {
    const range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + 1)
    );

    const decorationType = vscode.window.createTextEditorDecorationType({color: color});

    editor.setDecorations(decorationType, [range]);

    activeDecorations.push(decorationType);
}

export function revertDecorations(): void {
    activeDecorations.forEach((decoration) => decoration.dispose());
    activeDecorations = []; 
}
