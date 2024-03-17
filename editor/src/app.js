const axios = require('axios');
import './index.css';

const POST_URL = 'http://localhost:3002/';
let latx_session = false;



// init quill
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['image', 'link'],
        [{ 'color': [] }, { 'background': [] }],
        ['toolbarLatexBtn'],
      ],
      handlers: {
        toolbarLatexBtn: incertNewLatex,
      },
    },
  },
});

// init latex btn
const toolbarLatexBtn = document.querySelector('.ql-toolbarLatexBtn');
if (toolbarLatexBtn) {
  toolbarLatexBtn.innerHTML = 'Σ';
}

// compile btn onClick
document.getElementById('compile-btn').addEventListener('click', compileLatex);

// editor focuse event
document.getElementById("editor").firstChild.onfocus = () => {
  latexUnfocuse();
}

// latex blot
class ImageBlot extends Quill.import('blots/embed') {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('alt', value.alt || '');
    node.setAttribute('class', 'latex-selected');
    node.addEventListener('click', ()=>latexOnClick(node));
    //latexFocuse(node);
    return node;
  }
  static value(node) {
    return { url: node.getAttribute('src'), alt: node.getAttribute('alt') };
  }

  detach() { // on blot removal
    super.detach();
    latexUnfocuse();
  }
}
ImageBlot.blotName = 'customImage';
ImageBlot.tagName = 'img';
Quill.register(ImageBlot);




function latexUnfocuse() {
    
  if(latx_session?.setAttribute) {
    latx_session?.setAttribute('class', 'latex');
  } else if(latx_session.domNode) {
    latx_session?.domNode?.classList?.replace('latex-selected', 'latex');
  }
  latx_session = false;

  document.getElementById('latex-editor').style.transform = 'translateY(100%)';
}
function latexFocuse(node) {
  node?.setAttribute && node.setAttribute('class', 'latex-selected');
  if(latx_session?.domNode?.classList?.replace) {
    latx_session.domNode.classList.replace('latex', 'latex-selected');
  }
  latx_session = node;
  document.getElementById('latex-editor').style.transform = 'translateY(0%)';
}
function latexOnClick(node) {
  if(latx_session != node && latx_session) {
    // replace exicting latex_session with new one
    latexUnfocuse();
    latexFocuse(node);
    //quill.blur();
  } else if(latx_session != node) {
    // create new latx_session
    latexFocuse(node);
    // quill.blur(); // TODO, need to unfocuse, but this makes problems
  } else {
    // exicting latx_session is clicked
    latexUnfocuse();
  }
}
function incertNewLatex() {
  
  latexUnfocuse();

  const index = quill.getSelection().index || 0;
  quill.insertEmbed(index, 'customImage', { url: "https://clipart-library.com/image_gallery/396690.png" });
  quill.setSelection(index + 1);

  latexFocuse(quill.getLeaf(index + 1)[0]);
}
function compileLatex() {

  // if the compile-btn was pressed,
  // this must mean that latx_session is not false

  if (latx_session) {

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

          resultElm.value = "success";

          if(latx_session?.domNode?.src) {
            latx_session.domNode.src = `http://127.0.0.1:3002/${res?.data?.resSvgFilePath}`;
          } else if (latx_session?.src) {
            latx_session.src = `http://127.0.0.1:3002/${res?.data?.resSvgFilePath}`;
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
      .finally(e=>{
        latexUnfocuse();
      })

  } else {
    // TODO: this should never happen
    console.log("ERROR 3426232347757"); // TODO
  }
}




