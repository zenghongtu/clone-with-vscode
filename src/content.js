const githubDomain = 'github.com'
const giteeDomain = 'gitee.com'
const gitLabDomain = 'gitlab.com'

const defaultOptions = {
    isInsiders: false,
};


function getOptions() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(defaultOptions, (options) => {
            resolve(options);
        });
    });
}

const btnText = 'Clone with VSCode'

const setCloneWithVsCodeBtn = ({ parentSelector = () => { }, getUrl = () => { }, classList = [], style = {}, btnType = 'a' }) => {
    const $parent = parentSelector()
    if ($parent) {
        const $btn = document.createElement(btnType)
        $btn.classList.add(...classList)
        Object.keys(style).forEach((name)=>{
            $btn.style[name] = style[name]
        })
        $btn.innerText = btnText;
        $btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = getUrl()
            if(!url){
                console.error('get error url: ',url)
                return ;
            }
            const {isInsiders} =await getOptions()
      
            const scheme = isInsiders ? `vscode-insiders` : 'vscode';
            window.open(`${scheme}://vscode.git/clone?url=${url}`)
        };
        $parent.appendChild($btn)

    }
}


const href = location.href;

let parentSelector;
let getUrl;
let classList;
let style;
let btnType;

if (href.includes(githubDomain)) {
    parentSelector = () => document.querySelector('.file-navigation')
    getUrl = () => document.querySelector('.input-monospace').value
    classList = ['btn', 'btn-sm', 'BtnGroup-item']
    style = { marginLeft: '6px' }

} else if (href.includes(giteeDomain)) {
    parentSelector = () => document.querySelector('.git-project-right-actions')
    getUrl = () => document.querySelector('#project_clone_url').value
    classList = ['ui', 'button']
    btnType = 'div'

} else if (href.includes(gitLabDomain)) {
    parentSelector = () => document.querySelector('.tree-controls')
    getUrl = () => document.querySelector('#http_project_clone').value
    classList = ['btn']

}

setCloneWithVsCodeBtn({
    parentSelector, getUrl, classList,
    style, btnType
})





