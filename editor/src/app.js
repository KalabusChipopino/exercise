const axios = require('axios');
import './index.css';

const POST_URL = 'http://localhost:3002/';
let latex_session = false;



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
        toolbarLatexBtn: incertNewLatex,
        toolbarSaveBtn: toolbarSaveBtnHandler,
      },
    },
  },
});

// init latex btn
const toolbarLatexBtn = document.querySelector('.ql-toolbarLatexBtn');
if (toolbarLatexBtn) {
  toolbarLatexBtn.innerHTML = 'Σ';
}
// init save btn
const toolbarSaveBtn = document.querySelector('.ql-toolbarSaveBtn');
if (toolbarSaveBtn) {
  toolbarSaveBtn.innerHTML = 'save';
}

// compile btn onClick evt
document.getElementById('compile-btn').addEventListener('click', compileLatex);

// editor focuse event
// document.getElementById("editor").firstChild.onfocus = () => {}
quill.on('selection-change', function (range, oldRange, source) {
  if (range !== null) {
    latexUnfocuse();
  }
});

// latex blot
class ImageBlot extends Quill.import('blots/embed') {

  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url || '');
    node.setAttribute('class', 'latex');
    node.setAttribute('title', value.title || '');

    node.setLatex = (str) => { node.setAttribute('title', str); }
    node.getLatex = () => { return node.getAttribute('title') || ''; }

    node.addEventListener('click', () => latexOnClick(node));
    return node;
  }

  static value(node) {
    return { url: node.getAttribute('src'), title: node.getAttribute('title') };
  }
  detach() { // on blot removal
    super.detach();
    latexUnfocuse();
  }


}
ImageBlot.blotName = 'customImage';
ImageBlot.tagName = 'img';
Quill.register(ImageBlot);





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
function incertNewLatex() {

  latexUnfocuse();

  const index = quill.getSelection().index || 0;
  quill.insertEmbed(index, 'customImage', { url: "https://clipart-library.com/image_gallery/396690.png" });
  quill.setSelection(index + 1);

  latexFocuse(quill.getLeaf(index + 1)[0]?.domNode);

  quill.blur();
}
function compileLatex() {

  // if the compile-btn was pressed,
  // this must mean that latex_session is not false

  if (latex_session) {

    const value = document.getElementById('latex-textarea')?.value;

    // send latex to the compiler

    axios.post(POST_URL, value, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
      .then(res => {
        const resultElm = document.getElementById('latex-result');
        if (!res?.data?.success) resultElm.value = res.data.msg;
        else {

          if (latex_session?.src) {
            latex_session.src = `http://127.0.0.1:3002/${res?.data?.resSvgFilePath}`;
            latex_session.setLatex(value);
            resultElm.value = '';
            latexUnfocuse();
          } else {
            console.log("ERROR 23462346"); // TODO
          }

        }
      })
      .catch(error => {
        alert("something whent wrong");
        if (error.response) {
          // TODO
          // The request was made, but the server responded with a status code outside the range of 2xx
          console.error('Error:', error.response.data);
        } else {
          // TODO
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', error.message);
        }
      })

  } else {
    // TODO: this should never happen
    console.log("ERROR 3426232347757"); // TODO
  }
}

function findAllCustomImages(obj, results = []) {
  if (typeof obj === 'object' && obj !== null) {
    if ('customImage' in obj) {
      results.push(obj.customImage.url);
    } else {
      for (let key in obj) {
        findAllCustomImages(obj[key], results);
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
function toolbarSaveBtnHandler() {
  updateContent(selected);
  // TODO: post request to save exercise
}
for (let elm of Object.keys(SELECT)) {
  addOnClick(elm);
}
select(SELECT.exercise);
