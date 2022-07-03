import * as vsc from 'vscode';
import toggleInterval from './commands/toggleInterval';
export function activate(context: vsc.ExtensionContext) {
const commands = [
		// vsc.commands.registerCommand('my-command', () => {}),
		// vsc.commands.registerTextEditorCommand("divide-selection.myCommand", myCommand),
		vsc.commands.registerTextEditorCommand("interval-editing.toggleInterval", toggleInterval),
	];

	context.subscriptions.push(...commands);
}

export function deactivate() {}