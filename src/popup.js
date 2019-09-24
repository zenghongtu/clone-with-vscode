
const defaultOptions = {
    isInsiders: false,
};

function restoreOptions() {
    chrome.storage.sync.get(defaultOptions, (options) => {
        document.getElementById('isInsiders').checked = options.isInsiders;
    });
}

function saveOptions(obj) {
    chrome.storage.sync.set(obj, () => {
        // TODO
    });
}


const cloneBtn = document.querySelector('#clone-btn')
cloneBtn.addEventListener('click', e => {
    const scheme = isInsiders ? `vscode-insiders` : 'vscode'
    const url = document.querySelector('#input-git-url').value
    window.open(`${scheme}://vscode.git/clone?url=${url}`)
})

const insidersCheckbox = document.querySelector('#isInsiders')
insidersCheckbox.addEventListener('click', e => {
    const checked = e.target.checked
    saveOptions({'isInsiders':checked})
})


document.addEventListener('DOMContentLoaded', restoreOptions);