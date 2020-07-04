const githubDomain = "github.com";
const giteeDomain = "gitee.com";
const gitLabDomain = "gitlab.com";

const defaultOptions = {
  isInsiders: false,
  bySSH: false,
};

function getOptions() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(defaultOptions, (options) => {
      resolve(options);
    });
  });
}

const btnText = "Clone with VSCode";

const openUrl = (url) => {
  const $a = document.createElement("a");
  $a.href = url;
  $a.style.display = "none";
  document.body.appendChild($a);
  $a.click();
  document.body.removeChild($a);
};

const setCloneWithVsCodeBtn = ({
  parentSelector = () => {},
  getGitUrl = () => {},
  classList = [],
  style = {},
  btnType = "a",
}) => {
  const $parent = parentSelector();
  if ($parent) {
    const $btn = document.createElement(btnType);
    $btn.classList.add(...classList);
    Object.keys(style).forEach((name) => {
      $btn.style[name] = style[name];
    });
    $btn.innerText = btnText;
    $btn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = getGitUrl();
      if (!url) {
        console.error("get error url: ", url);
        return;
      }
      const { isInsiders, bySSH } = await getOptions();

      const scheme = isInsiders ? `vscode-insiders` : "vscode";
      let gitCloneUrl = url;
      if (bySSH) {
        const arr = url.split("/");
        gitCloneUrl = `git@${arr[2]}:${arr[3]}/${arr[4]}`;
      }

      const href = `${scheme}://vscode.git/clone?url=${gitCloneUrl}`;

      openUrl(href);
    };
    $parent.appendChild($btn);
  }
};

const main = () => {
  let parentSelector;
  let getGitUrl;
  let classList;
  let style;
  let btnType;

  const href = location.href;

  if (href.includes(githubDomain)) {
    parentSelector = () => document.querySelector(".file-navigation");
    getGitUrl = () => document.querySelector(".input-monospace").value;
    classList = ["btn", "mr-2", "d-none", "d-md-block"];
    style = { marginLeft: "6px" };
  } else if (href.includes(giteeDomain)) {
    parentSelector = () => document.querySelector(".git-project-right-actions");
    getGitUrl = () => document.querySelector("#project_clone_url").value;
    classList = ["ui", "button"];
    btnType = "div";
  } else if (href.includes(gitLabDomain)) {
    parentSelector = () => document.querySelector(".tree-controls");
    getGitUrl = () => document.querySelector("#http_project_clone").value;
    classList = ["btn"];
  }

  setCloneWithVsCodeBtn({
    parentSelector,
    getGitUrl,
    classList,
    style,
    btnType,
  });
};

// only show at repo homepage
const isAtRepoHomepage =
  location.pathname.split("/").filter(Boolean).length === 2;

if (isAtRepoHomepage) {
  main();
}
