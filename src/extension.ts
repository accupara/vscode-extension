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
		vscode.commands.registerCommand('craveDevspaces.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from Crave Devspaces!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.executeLs', () => {
			provider.updateOutput('Executing command...');
			// Execute the command without showing the terminal
			exec('ls -lha', (error, stdout, stderr) => {
			  if (error) {
				console.error(error);
				provider.updateOutput(`Error: ${stderr}`);
			  } else {
				// console.log(stdout);
				provider.updateOutput(stdout);
			  }
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('craveDevspaces.craveList', () => {
			// Create a new terminal or use an existing one
			let terminal = vscode.window.activeTerminal;
			if (!terminal) {
			  // If no active terminal, create a new one
			  terminal = vscode.window.createTerminal('Crave Terminal');
			}
		
			// Show the terminal and run the command
			terminal.show(true); // Show the terminal and bring it to front
			terminal.sendText('crave list'); // Send the command to be executed
		})
	);
}

export function deactivate() {}
