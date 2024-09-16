import * as vscode from 'vscode';
import { SidebarViewProvider } from './SidebarViewProvider';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "crave-devspaces" is now active!');

	const provider = new SidebarViewProvider(context.extensionUri);
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarViewProvider.viewType, provider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.devspaceConnect', () => {
			provider.updateOutput('Executing command: crave devspace');

			exec('~/Documents/work/crv/crave -c ~/Documents/work/crv/conf/crave.mkams9.conf devspace', (error, stdout, stderr) => {
				if (error) {
					// console.error(error);
					provider.updateOutput(stderr);
				} else {
					// console.log(stdout);
					provider.updateOutput(stdout);
				}
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.craveCloneList', () => {
			provider.updateOutput('Executing command: crave clone list');

			exec('crave clone list', (error, stdout, stderr) => {
				if (error) {
					// console.error(error);
					provider.updateOutput(stderr);
				} else {
					// console.log(stdout);
					provider.updateOutput(stdout);
				}
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.craveList', () => {
			provider.updateOutput('Executing command: crave list');

			// ~/Documents/work/crv/crave -c ~/Documents/work/crv/conf/crave.mkams9.conf list

			exec('crave list', (error, stdout, stderr) => {
				if (error) {
					// console.error(error);
					provider.updateOutput(stderr);
				} else {
					// console.log(stdout);
					provider.updateOutput(stdout);
				}
			});
		})
	);
}

export function deactivate() {}
