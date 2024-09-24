(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { projects: [], clones: [] };

    if (oldState.projects && oldState.projects.length) {
        updateListViews(oldState.projects, 'project');
    }

    if (oldState.clones && oldState.clones.length) {
        updateListViews(oldState.clones, 'clone');
    }

    document.querySelector('.crave-clone-list-button').addEventListener('click', () => {
        vscode.postMessage({ command: 'craveCloneList' });
    });

    document.querySelector('.crave-list-button').addEventListener('click', () => {
        vscode.postMessage({ command: 'craveList' });
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent

        switch (message.command) {
            case 'craveCloneList':
            case 'craveList':
                {
                    toggleProgressLine();

                    if (message.output) {
                        let value = message.output;
                        let parts = value.match(/.+(\n)+/g);
                        let v = { labels:[], pkeys: [], prows: [], ckeys: [], crows: [], e: [] };
                        
                        if (parts && parts.length > 1) {
                            parts.map(p => {
                                if (p.indexOf('\n\n\n') > -1) {
                                    p = p.replace('\n\n\n', '\n');
                                }
                                
                                if (p.indexOf('\n\n') > -1) {
                                    v.labels.push(p.replace('\n\n', '').trim());
                                }
                                else if (p.indexOf('--') > -1) {
                                    v.e.push(p);   
                                }
                                else if (v.labels.length === 1) {
                                    if (!v.pkeys.length) {
                                        v.pkeys = p.replace('\n', '').split(/\s{2}/g).filter(k => k.length).map(k => k.trim());
                                    }
                                    else {
                                        v.prows.push(p.replace('\n', '').split(/\s{2}/g).filter(k => k.length).map(k => k.trim()));
                                    }
                                }
                                else if (v.labels.length > 1) {
                                    if (!v.ckeys.length) {
                                        v.ckeys = p.replace('\n', '').split(/\s{2}/g).filter(k => k.length).map(k => k.trim());
                                    }
                                    else {
                                        v.crows.push(p.replace('\n', '').split(/\s{2}/g).filter(k => k.length).map(k => k.trim()));
                                    }
                                }
    
                                return p;
                            });
                            
                            if (v.prows.length) {
                                updateListViews(v.prows, 'project');
                            }

                            if (v.crows.length) {
                                updateListViews(v.crows, 'clone');
                            }

                            updateMessageView();
                        }
                        else {
                            updateMessageView(message.output);
                        }
                    }
                    break;
                }
            case 'craveClone':
            default: 
                updateMessageView(message.output);
        }
    });

    function updateMessageView(message) {
        let container = document.querySelector('.message-view');
        
        if (container && message) {
            container.textContent = message;
            container.className = 'message-view';
        }
        else if (container) {
            container.textContent = '';
            container.className = 'message-view hide';
        }
    }

    function updateListViews(rows, type) {
        const view = document.querySelector(`.${type}-view`);
        if (view && rows.length) {
            view.textContent = '';
            
            const defaultViewPara = document.querySelectorAll('.default-view p');
            
            for (const para of defaultViewPara) {
                para.className = 'hide';
            }

            const h2 = document.createElement('h2');
            h2.textContent = type === 'project' ? 'Projects:' : 'Clones:';
            view.appendChild(h2);
            
            const ul = document.createElement('ul');

            for (const row of rows) {
                const li = document.createElement('li');
                li.className = `row`;

                const preview = document.createElement('div');
                preview.className = `preview`;
                
                const name = document.createElement('span');
                name.textContent = row[1];

                const url = document.createElement('span');
                url.textContent = row[2];
                url.title = row[2];

                preview.appendChild(name);
                preview.appendChild(url);

                const options = document.createElement('div');
                options.className = `options`;

                const cloneButton = document.createElement('button');
                cloneButton.textContent = type === 'project' ? 'Clone' : 'Destroy';

                cloneButton.addEventListener('click', () => {
                    let 
                        parts = row[2].split('/'),
                        dest = parts[parts.length-1].replace('.git', '');
                    
                    updateMessageView(`${cloneButton.textContent}: ${row[0]}, ${dest}, ${row[1]}, ${row[2]}`);

                    vscode.postMessage({ command: 'craveClone', projectId: row[0], destination: dest });
                });

                options.appendChild(cloneButton);

                li.appendChild(preview);
                li.appendChild(options);
                ul.appendChild(li);
            }

            view.appendChild(ul);

            // Update the saved state
            const oldState = vscode.getState() || { projects: [], clones: [] };
            vscode.setState({ 
                ...oldState,
                [`${type}s`]: rows 
            });
        }
    }

    function toggleProgressLine() {
        let progressLine = document.querySelector('.progress-line-container');

        if (progressLine) {
            if (progressLine.className === 'progress-line-container') {
                progressLine.className = 'progress-line-container hide';
            }
            else {
                progressLine.className = 'progress-line-container';
            }
        }
    }
}());