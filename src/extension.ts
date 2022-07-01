import * as vsc from 'vscode';
import divideByLines from './commands/splitByLines';
export function activate(context: vsc.ExtensionContext) {
const commands = [
		// vsc.commands.registerCommand('my-command', () => {}),
		// vsc.commands.registerTextEditorCommand("divide-selection.myCommand", myCommand),
		vsc.commands.registerTextEditorCommand("divide-selection.divideByLines", divideByLines),
	];

	context.subscriptions.push(...commands);
}

export function deactivate() {}