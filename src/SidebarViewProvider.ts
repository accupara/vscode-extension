import * as vscode from 'vscode';

export class SidebarViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'craveDevspaces.mySidebarView';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;
        
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Listen to messages from the webview if needed
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'craveCloneList') {
                vscode.commands.executeCommand('craveDevspaces.craveCloneList', message.noLog);
            } else if (message.command === 'craveList') {
                vscode.commands.executeCommand('craveDevspaces.craveList');
            } else if (message.command === 'craveClone') {
                vscode.commands.executeCommand('craveDevspaces.craveClone', message.projectId, message.destination);
            } else if (message.command === 'craveCloneDestroy') {
                vscode.commands.executeCommand('craveDevspaces.craveCloneDestroy', message.destination);
            } else if (message.command === 'openFolder') {
                vscode.commands.executeCommand('craveDevspaces.openFolder', message.folderPath);
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        
        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Crave Devspaces</title>

                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
            </head>
            <body>
                <div class="progress-line-container hide">
                    <div class="progress-line"></div>
                </div>
                <div class="welcome-view-content">
                    <div class="message-view hide"></div>

                    <div class="project-view"></div>

                    <div class="clone-view"></div>

                    <div class="default-view">
                        <p>Welcome to Crave Devspaces!</p>
                        <p>Checkout the project repos available to clone or already cloned:</p>
                    
                        <div class="button-container">
                            <button role="button" class="crave-clone-list-button">Crave Clone List</button>
                        </div>
                        
                        <div class="button-container">
                            <button role="button" class="crave-list-button">Crave List</button>
                        </div>
                    </div>
                </div>

                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }

    // Function to send command output to the webview
    public updateOutput(command: string, output: string) {
        if (this._view) {
            this._view.webview.postMessage({ command: command || 'updateOutput', output });
        }
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}