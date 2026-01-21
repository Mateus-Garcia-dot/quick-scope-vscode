import * as vscode from 'vscode';
import { handleLineChangeEvent } from './change_line_event';
import { revertDecorations } from './handle_color_change';

let isWaitingForChar = false;
let lastCursorPosition: vscode.Position | undefined;

export function activate(context: vscode.ExtensionContext) {
    const toggleMode = vscode.commands.registerCommand('quick-scope-vscode.toggleMode', () => {
        const config = vscode.workspace.getConfiguration('quickScope');
        const currentMode = config.get<string>('activationMode', 'always');
        const newMode = currentMode === 'always' ? 'onKeyPress' : 'always';
        
        config.update('activationMode', newMode, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage(
            `Quick Scope: ${newMode === 'always' ? 'Always On' : 'On f/F/t/T Press'}`
        );
        
        if (newMode === 'onKeyPress') {
            revertDecorations();
        }
    });
    
    const findForward = vscode.commands.registerCommand('quick-scope-vscode.triggerFind', async () => {
        await triggerHighlights('f');
    });
    
    const findBackward = vscode.commands.registerCommand('quick-scope-vscode.triggerFindBackward', async () => {
        await triggerHighlights('F');
    });
    
    const tillForward = vscode.commands.registerCommand('quick-scope-vscode.triggerTill', async () => {
        await triggerHighlights('t');
    });
    
    const tillBackward = vscode.commands.registerCommand('quick-scope-vscode.triggerTillBackward', async () => {
        await triggerHighlights('T');
    });
    
    const cursorChangeListener = vscode.window.onDidChangeTextEditorSelection((event) => {
        const config = vscode.workspace.getConfiguration('quickScope');
        const mode = config.get<string>('activationMode', 'always');
        
        if (mode === 'always') {
            const editor = event.textEditor;
            if (!editor) {
                return;
            }
            
            
            handleLineChangeEvent(editor);
        } else if (isWaitingForChar) {
            const currentPosition = event.textEditor.selection.active;
            
            if (lastCursorPosition && !currentPosition.isEqual(lastCursorPosition)) {
                isWaitingForChar = false;
                lastCursorPosition = undefined;
                revertDecorations();
            }
        }
    });
    
    context.subscriptions.push(
        toggleMode,
        findForward,
        findBackward,
        tillForward,
        tillBackward,
        cursorChangeListener
    );
}

async function triggerHighlights(key: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const config = vscode.workspace.getConfiguration('quickScope');
    const mode = config.get<string>('activationMode', 'always');
    
    if (mode === 'onKeyPress') {
        isWaitingForChar = true;
        
        lastCursorPosition = editor.selection.active;

        const cursorStyle = editor.options.cursorStyle;
        const isNormalOrVisual =
            cursorStyle === vscode.TextEditorCursorStyle.Block ||
            cursorStyle === vscode.TextEditorCursorStyle.BlockOutline;

        if (isNormalOrVisual)  {
            handleLineChangeEvent(editor);
        }
    }
    
    await vscode.commands.executeCommand('type', { text: key });
}

export function deactivate() {
    revertDecorations();
}
