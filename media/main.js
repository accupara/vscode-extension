//@ts-check

(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();

    // @ts-ignore
    document.querySelector('.crave-connect-button').addEventListener('click', () => {
        vscode.postMessage({ command: 'devspaceConnect' });
    });

    // @ts-ignore
    document.querySelector('.crave-clone-list-button').addEventListener('click', () => {
        vscode.postMessage({ command: 'craveCloneList' });
    });

    // @ts-ignore
    document.querySelector('.crave-list-button').addEventListener('click', () => {
        vscode.postMessage({ command: 'craveList' });
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        let output = document.querySelector('#output');
        
        if (output) {
            output.textContent = message.output;
        }
    });
}());