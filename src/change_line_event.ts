import * as vscode from 'vscode';
import { applyTextColor, revertDecorations } from './handle_color_change';
import { getCoordinatesToHighlight } from './color_line_rules';

export function handleLineChangeEvent(editor: vscode.TextEditor | undefined): void {
    if (!editor) {
        return;
    }

    const config = vscode.workspace.getConfiguration('lineChangeHighlight');
    const firstColor = config.get<string>('firstColor', '#00FF00');
    const secondColor = config.get<string>('secondColor', '#0000FF');

    const currentLine = editor.selection.active.line;
    const currentCharacter = editor.selection.active.character;
    const lineContent = editor.document.lineAt(currentLine).text;

    revertDecorations();

    const highlights = getCoordinatesToHighlight(lineContent, currentCharacter);
    highlights.firstJumps.map((charCoord) => {
        applyTextColor(editor, currentLine, charCoord, firstColor);
    });
    highlights.secondJumps.map((charCoord) => {
        applyTextColor(editor, currentLine, charCoord, secondColor);
    });

}