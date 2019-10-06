const defaultOptions = {
    isInsiders: false,
    bySSH: false
};

let curOptions = {};

function restoreOptions() {
    chrome.storage.sync.get(defaultOptions, options => {
        Object.keys(options).forEach(_id => {
            document.getElementById(_id).checked = options[_id];
        });
        curOptions = { ...options };
    });
}

function saveOptions(obj) {
    chrome.storage.sync.set(obj, () => {
        curOptions = { ...curOptions, ...obj };
    });
}

const openUrl = url => {
    const $a = document.createElement('a');
    $a.href = url;
    $a.style.display = 'none';
    document.body.appendChild($a);
    $a.click();
    document.body.removeChild($a);
};

const handleCloneBtnClick = () => {
    const gitUrl = document.querySelector('#input-git-url').value;
    if (!gitUrl) {
        return;
    }
    const scheme = curOptions.isInsiders ? `vscode-insiders` : 'vscode';
    const url = document.querySelector('#input-git-url').value;
    window.open(`${scheme}://vscode.git/clone?url=${url}`);
};

document.body.addEventListener('click', e => {
    const _id = e.target.id;
    if (!_id) {
        return;
    }

    switch (_id) {
        case 'clone-btn':
            handleCloneBtnClick();
            return;
        case 'isInsiders':
        case 'bySSH':
            const checked = e.target.checked;
            saveOptions({ [_id]: checked });
            return;
        default:
            return;
    }
});

document.addEventListener('DOMContentLoaded', restoreOptions);
