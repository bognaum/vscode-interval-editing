import * as vsc from 'vscode';
import divideByLines from './commands/splitByLines';
export function activate(context: vsc.ExtensionContext) {
const commands = [
		// vsc.commands.registerCommand('my-command', () => {}),
		vsc.commands.registerTextEditorCommand("divide-selection.divideByLines", divideByLines),
		vsc.commands.registerTextEditorCommand('divide-selection.divide', async (
			tEditor: vsc.TextEditor, 
			edit: vsc.TextEditorEdit, 
			...args: any[]
		) => {
			const text = await vsc.window.showInputBox({
				placeHolder: "XXXXXX",
			});
			vsc.window.showInformationMessage(text || "");
		}),
	];

	context.subscriptions.push(...commands);
}

export function deactivate() {}