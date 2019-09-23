const isInsiders = false
const scheme = isInsiders ? `vscode-insiders` : 'vscode'

const cloneBtn = document.querySelector('#clone-btn')
cloneBtn.addEventListener('click', e => {
    const url = document.querySelector('#input-git-url').value
    window.open(`${scheme}://vscode.git/clone?url=${url}`)
})