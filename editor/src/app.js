const axios = require('axios');
import './index.css';

const POST_URL = 'http://localhost:3002/';
let latex_session = false;

const topLatex = `\\documentclass{article}\n\\thispagestyle{empty}\n\\begin{document}\n`;
const bottomLatex = '\\end{document}';

// init quill
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link'],
        [{ 'color': [] }, { 'background': [] }],
        ['toolbarLatexBtn'],
        ['toolbarSaveBtn'],
      ],
      handlers: {
        toolbarLatexBtn: toolbarLatexBtnHandle,
        toolbarSaveBtn: toolbarSaveBtnHandle,
      },
    },
  },
});

// init save btn
const toolbarMathBtn = document.querySelector('.ql-toolbarMathBtn');
if (toolbarMathBtn) {
  toolbarMathBtn.innerHTML = 'Σ';
}
// init latex btn
const toolbarLatexBtn = document.querySelector('.ql-toolbarLatexBtn');
if (toolbarLatexBtn) {
  toolbarLatexBtn.innerHTML = 'Latex';
}
// init save btn
const toolbarSaveBtn = document.querySelector('.ql-toolbarSaveBtn');
if (toolbarSaveBtn) {
  toolbarSaveBtn.innerHTML = 'save';
}



// compile btn onClick evt
document.getElementById('compile-btn').addEventListener('click', compileLatex);
// editor focuse event
quill.on('selection-change', function (range, oldRange, source) {
  if (range !== null) {
    latexUnfocuse();
  }
});

// caret pos change evt
quill.on('selection-change', function (range, oldRange, source) {
  blurLatex();
});



// latex blot
class LatexBlot extends Quill.import('blots/embed') {

  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url || '');
    node.setAttribute('class', value.class || '');
    node.setAttribute('latex', value.latex || '');

    node.setSrc = (url) => { node.setAttribute('src', url); }
    node.setLatex = (str) => { node.setAttribute('latex', str); }
    node.getLatex = () => { return node.getAttribute('latex') || ''; }

    node.addEventListener('click', () => latexOnClick(node));
    return node;
  }

  static value(node) {
    return { url: node.getAttribute('src'), latex: node.getAttribute('latex'), class: node.getAttribute('class') };
  }
  detach() { // on blot removal
    super.detach();
    latexUnfocuse();
  }


}
LatexBlot.blotName = 'latexBlot';
LatexBlot.tagName = 'img';
Quill.register(LatexBlot);





function selectLatex(node) {
  if (node?.setAttribute) {
    node.setAttribute('class', 'latex-selected');
  }
}
function blurLatex() {
  if (latex_session?.setAttribute) {
    latex_session.setAttribute('class', 'latex');
  }
}

function latexUnfocuse() {

  if (latex_session?.setAttribute) {
    latex_session?.setAttribute('class', 'latex');
  } else if (latex_session.domNode) {
    latex_session?.domNode?.classList?.replace('latex-selected', 'latex');
  }
  latex_session = false;

  blurLatex();
  document.getElementById('latex-editor').style.transform = 'translateY(100%)';
}
function latexFocuse(node) {

  selectLatex(node);

  latex_session = node;
  document.getElementById('latex-editor').style.transform = 'translateY(0%)';

  const latex = node.getLatex();
  console.log("AAAAAAA", latex)
  if (latex) document.getElementById('latex-textarea').value = latex;

  document.getElementById('latex-result').value = '';
}

function latexOnClick(node) {

  if (latex_session != node && latex_session) {
    // replace exicting latex_session with new one
    latexUnfocuse();
    latexFocuse(node);
  } else if (latex_session != node) {
    // create new latex_session
    latexFocuse(node);
  } else {
    // exicting latex_session is clicked
    latexUnfocuse();
  }
}
function toolbarLatexBtnHandle() {

  latexUnfocuse();

  const index = quill.getSelection().index || 0;
  quill.insertEmbed(index, 'latexBlot', { url: "https://clipart-library.com/image_gallery/396690.png" });
  quill.setSelection(index + 1);

  latexFocuse(quill.getLeaf(index + 1)[0]?.domNode);

  quill.blur();
}
function compileRawLatex(latex) {
  return new Promise((resolve, reject) => {
    axios.post(POST_URL, latex, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
      .then(res => {
        if (!res?.data?.success) {
          console.log("ERROR 1234135351"); // TODO: debug
          resolve(res.data.msg);
        } else {
          if (res?.data?.resSvgFilePath) {
            resolve(`/compiler/tmp/${res.data.resSvgFilePath}`);
          } else {
            reject("an error has accured"); // TODO: ast
          }
        }
      })
      .catch(error => {
        alert("something whent wrong");
        if (error.response) {
          // TODO: debug
          // The request was made, but the server responded with a status code outside the range of 2xx
          console.error('ERROR 2352363464', error.response.data);
          reject("an error has accured"); // TODO: ast
        } else {
          // TODO
          // Something happened in setting up the request that triggered an Error
          console.error('ERROR 2436237357373', error.message);
          reject("an error has accured"); // TODO: ast
        }
      })
  });

}
function compileLatex() {

  // if the compile-btn was pressed,
  // this must mean that latex_session is not false

  if (latex_session) {

    const value = document.getElementById('latex-textarea')?.value;
    const resultElm = document.getElementById('latex-result');

    compileRawLatex(value).then((res) => {
      latex_session.setSrc(res);
      latex_session.setLatex(value);
      blurLatex();
      latex_session = false;
    })

  } else {
    // TODO: this should never happen
    console.log("ERROR 3426232347757"); // TODO
  }
}

function findAllLatexBlots(obj, results = []) {
  if (typeof obj === 'object' && obj !== null) {
    if ('latexBlot' in obj) {
      results.push(obj.latexBlot.url);
    } else {
      for (let key in obj) {
        findAllLatexBlots(obj[key], results);
      }
    }
  }
  return results;
}






const SELECT = {
  exercise: 'exercise',
  hint: 'hint',
  answer: 'answer',
  explain: 'explain',
}
const CONTENT = {
  exercise: {},
  hint: {},
  answer: {},
  explain: {},
}
let selected = SELECT.exercise;

function updateContent(selection) {
  CONTENT[selected] = quill.getContents()?.ops || {}; // save
  quill.setContents(CONTENT[selection]); // update
}
function select(selection) {

  updateContent(selection);

  const elm = document.getElementById(`${SELECT[selection]}-btn`);
  const oldElm = document.getElementById(`${selected}-btn`);
  selected = SELECT[selection];

  elm.classList.add('menu-btn-selected');
  elm.classList.remove('menu-btn');

  if (elm !== oldElm) {
    oldElm.classList.add('menu-btn');
    oldElm.classList.remove('menu-btn-selected');
  }

  return SELECT[selection];
}
function addOnClick(btnName) {

  if (!Object.values(SELECT).includes(btnName)) {
    // TODO: debug
  }

  document.getElementById(`${btnName}-btn`).addEventListener('click', () => {
    select(btnName);
  });
}
function toolbarSaveBtnHandle() {
  updateContent(selected);
  // TODO: post request to save exercise
}
for (let elm of Object.keys(SELECT)) {
  addOnClick(elm);
}
select(SELECT.exercise);




window.addEventListener('load', () => {
  document.getElementById('latex-textarea').innerHTML = `${topLatex}\n${bottomLatex}`;
})