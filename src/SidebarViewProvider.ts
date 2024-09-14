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
        if (message.command === 'executeCommand') {
            vscode.commands.executeCommand('craveDevspaces.executeLs');
        }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
    
    // Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Crave Devspaces</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 10px; }
          pre { padding: 10px; border-radius: 4px; text-wrap: wrap; }
        </style>
      </head>
      <body>
        <h2>Crave Devspaces</h2>
        <div class="welcome-view-content wide" tabindex="0" style="overflow: hidden; height: 979px; width: 665px;">
          <p>In order to use Git features, you can open a folder containing a Git repository or clone from a URL.</p>
          <div class="button-container">
            <a class="monaco-button monaco-text-button" tabindex="0" role="button" aria-disabled="false" style="color: var(--vscode-button-foreground); background-color: var(--vscode-button-background);">
              <span>Crave Clone List</span>
            </a>
          </div>
          <div class="button-container">
            <a class="monaco-button monaco-text-button" tabindex="0" role="button" aria-disabled="false" style="color: var(--vscode-button-foreground); background-color: var(--vscode-button-background);">
              <span>Show Crave Conf</span>
            </a>
          </div>
          <!-- <p>To learn more about how to use Git and source control in VS Code <a class="monaco-link" tabindex="0" href="https://aka.ms/vscode-scm" role="button" aria-disabled="false" style="pointer-events: auto; opacity: 1; cursor: pointer;">read our docs</a>.</p> -->
        </div>

        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }

  // Function to send command output to the webview
  public updateOutput(output: string) {
    if (this._view) {
      this._view.webview.postMessage({ command: 'updateOutput', output });
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