import Quill from 'quill';
import 'quill/dist/quill.snow.css';
const Inline = Quill.import('blots/inline');

function customButtonHandler() {  
  //var divElement = document.createElement('div');
  //divElement.innerHTML = `<div id="complicatedElement"><h1>This is a complicated element</h1><p>... More content ...</p></div>`;

  //quill.insertEmbed(quill.getSelection().index, 'customDiv', divElement);
  
  //quill.insertText(0, 'Test', { custom: true });
  //quill.format('h1', true);

  const index = quill.getSelection().index || 0;
  quill.insertEmbed(index, 'image', "https://clipart-library.com/image_gallery/396690.png", 'user');
}

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['image', 'link'],
        [{ 'color': [] }, { 'background': [] }],
        ['customButton'],
      ],
      handlers: {
        customButton: customButtonHandler,
      },
    },
  },
});

const customButton = document.querySelector('.ql-customButton');
if (customButton) {
  customButton.innerHTML = 'Σ';
}

var BlockEmbed = Quill.import('blots/block/embed');
class CustomDivBlot extends BlockEmbed {
  static create(value) {
    //const node = super.create(value);
    //node.innerHTML = value.innerHTML;
    let node = super.create();
    node.setAttribute('href', url);
    node.setAttribute('target', '_blank');
    node.setAttribute('title', node.textContent);
    return node;
  }
}
CustomDivBlot.blotName = 'customDiv';
CustomDivBlot.tagName = 'div';
Quill.register(CustomDivBlot);







class BoldBlot extends Inline {
  static blotName = 'custom';
  static tagName = 'h1';
}
Quill.register(BoldBlot);
