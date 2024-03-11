const axios = require('axios');
import './index.css';

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

let latx_session = false;
function toolbarLatexHandler() {
  const index = quill.getSelection().index || 0;
  quill.insertEmbed(index, 'customImage', { url: "https://clipart-library.com/image_gallery/396690.png" });
  quill.setSelection(index + 1);

  latx_session = quill.getLeaf(index)[0];
}


class ImageBlot extends Quill.import('blots/embed') {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('alt', value.alt || '');
    node.setAttribute('class', 'latex');
    node.addEventListener('click', () => {
      console.log("TODO")
    });
    return node;
  }
  static value(node) {
    return { url: node.getAttribute('src'), alt: node.getAttribute('alt') };
  }
}
ImageBlot.blotName = 'customImage';
ImageBlot.tagName = 'img';
Quill.register(ImageBlot);


const post_url = 'http://localhost:3002/';
document.getElementById('latex-btn').addEventListener('click', () => {

  const value = document.getElementById('latex-textarea')?.value;

  axios.post(post_url, value, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
    .then(res => {
      const resultElm = document.getElementById('latex-result');
      if(!res?.data?.success) resultElm.value = res.data.msg;
      else {
        resultElm.value = "success";
        console.log(res?.data?.resSvgFilePath);

        if (latx_session && latx_session.domNode.tagName === "IMG") {
          latx_session.domNode.src = `http://127.0.0.1:3002/${res?.data?.resSvgFilePath}`;
        }
        latx_session = false;
      }
    })
    .catch(error => {
      alert("something whent wrong");
      if (error.response) {
        // The request was made, but the server responded with a status code outside the range of 2xx
        console.error('Error:', error.response.data);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    })
});