const axios = require('axios');
import './index.css';

const POST_URL = 'http://localhost:3002/';

let latx_session = false;
function latexUnfocuse() {
  if(latx_session?.setAttribute) {
    latx_session?.setAttribute('class', 'latex');
  }
  latx_session = false;
}
function latexFocuse(node) {
  node?.setAttribute('class', 'latex-selected');
  latx_session = node;
}

// init
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
        toolbarLatexBtn: toolbarLatexHandler,
      },
    },
  },
});
const toolbarLatexBtn = document.querySelector('.ql-toolbarLatexBtn');
if (toolbarLatexBtn) {
  toolbarLatexBtn.innerHTML = 'Σ';
}
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
    node.setAttribute('class', 'latex');

    node.addEventListener('click', () => {
      if(latx_session != node && latx_session) {
        // replace exicting latex_session with new one
        latexUnfocuse();
        latexFocuse(node);
        quill.blur();
      } else if(latx_session != node) {
        // create new latx_session
        latexFocuse(node);
        quill.blur();
      } else {
        // exicting latx_session is clicked
        latexUnfocuse();
      }
      
    });
    return node;
  }
  static value(node) {
    return { url: node.getAttribute('src'), alt: node.getAttribute('alt') };
  }

  detach() { // omn blot removal
    super.detach();
    latexUnfocuse();
  }
}
ImageBlot.blotName = 'customImage';
ImageBlot.tagName = 'img';
Quill.register(ImageBlot);

// create new latex
function toolbarLatexHandler() {
  
  latexUnfocuse();

  const index = quill.getSelection().index || 0;
  quill.insertEmbed(index, 'customImage', { url: "https://clipart-library.com/image_gallery/396690.png" });
  quill.setSelection(index + 1);

  latx_session = quill.getLeaf(index + 1)[0];
}

// compile button
document.getElementById('compile-btn').addEventListener('click', () => {

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

          latexUnfocuse();

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
  }
});
