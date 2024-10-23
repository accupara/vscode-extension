import * as vscode from 'vscode';
import { SidebarViewProvider } from './SidebarViewProvider';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	const provider = new SidebarViewProvider(context.extensionUri);
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarViewProvider.viewType, provider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.craveCloneList', () => {
			provider.updateOutput('craveCloneList', 'Executing command: crave clone list');

			exec('crave clone list', (error, stdout, stderr) => {
				if (error) {
					// console.error(error);
					provider.updateOutput('craveCloneList', stderr);
				} else {
					// console.log(stdout);
					provider.updateOutput('craveCloneList', stdout);
				}
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.craveList', () => {
			provider.updateOutput('craveList', 'Executing command: crave list');

			exec('crave list', (error, stdout, stderr) => {
				if (error) {
					// console.error(error);
					provider.updateOutput('craveList', stderr);
				} else {
					// console.log(stdout);
					provider.updateOutput('craveList', stdout);
				}
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.craveClone', (projectId, destination) => {
			let command = `crave clone create --projectID ${projectId} /crave-devspaces/${destination}`;
			
			provider.updateOutput('craveClone', `Executing command: ${command}`);

			exec(command, (error, stdout, stderr) => {
				if (error) {
					// console.error(error);
					provider.updateOutput('craveClone', stderr);
				} else {
					// console.log(stdout);
					provider.updateOutput('craveClone', stdout);
				}
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.craveCloneDestroy', (destination) => {
			let command = `crave clone destroy -y /crave-devspaces/${destination}`;
			
			provider.updateOutput('craveCloneDestroy', `Executing command: ${command}`);

			exec(command, (error, stdout, stderr) => {
				if (error) {
					// console.error(error);
					provider.updateOutput('craveCloneDestroy', stderr);
				} else {
					// console.log(stdout);
					provider.updateOutput('craveCloneDestroy', stdout);
				}
			});
		})
	);
}

export function deactivate() {}
