const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3003;
const corsOptions = {
  origin: 'http://127.0.0.1:3000',
  methods: 'POST',
  credentials: true,
  optionsSuccessStatus: 204,
};


app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static('/latex'));
app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}/`); });

app.post('/save', (req, res) => {

  // only exccepts array of strings like so: ['124125125.svg', ...]

  const data = req.body.data;

  if (typeof data !== typeof []) {
    // TODO: debug: `data is of type "${typeof data}" but should be of type "${typeof []}"`
    res.status(500).json({ success: false, msg: 'an error has aqqured' }); // TODO: ast
  }

  for (let elm of data) {
    
    if (typeof elm !== typeof '') {
      // TODO: debug: `"${elm}" is of wrong format`
      res.status(500).json({ success: false, msg: 'an error has aqured' }); // TODO: ast
    }
    if (!/\d*.svg/.test(elm)) {
      // TODO: debug: `"${elm}" is of wrong format`
      res.status(500).json({ success: false, msg: 'an error has aqured' }); // TODO: ast
    }

    // copy files from tmp to latex
    fs.copyFile(`tmp/${elm}`, `/latex/${elm}`, (err) => {
      if (err) {
        for (let subElm of data) {
          fs.unlink(`latex/${subElm}`, (err) => {
            if (err) {
              // TODO
              return;
            }
          });
        }
        // TODO: debug: `"cant copy ${elm} to "latex" dir"`
        res.status(500).json({ success: false, msg: 'an error has aqured' }); // TODO: ast
      }
      
      // sucecssfully copied files, now delet them from tmp
      fs.unlink(`tmp/${subElm}`, (err) => {
        if (err) {
          // TODO
          return;
        }
      });

    });
  }

})
