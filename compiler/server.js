const express = require('express');
const bodyParser = require('body-parser');
const { spawnSync } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3002;
const corsOptions = {
  origin: 'http://127.0.0.1:3000',
  methods: 'POST',
  credentials: true,
  optionsSuccessStatus: 204,
};

const file_latex_log = 'tmp/texput.log';

app.use(bodyParser.text());
app.use(cors(corsOptions));
app.use(express.static('tmp'));
app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}/`); });


app.post('/', (req, res) => {

  // compile() has sensitive info
  // give away as less info as possible in responce

  if (typeof req?.body !== 'string') {
    res.status(200).json({
      success: false,
      msg: "could not compile latex"
    });
  }

  const outputSvgFileNoExtNoPath = `${new Date().getTime()}`;

  const result = compile(req.body, outputSvgFileNoExtNoPath);

  if (result.exitCode === 1) {
    res.status(200).json({ success: false, msg: result.msg });
  } else if (result.exitCode) {
    console.log("ERROR:", result.msg)
    res.status(200).json({ success: false, msg: "could not compile latex" }); // TODO: ast
  } else {
    res.status(200).json({ success: true, resSvgFilePath: `${outputSvgFileNoExtNoPath}.svg` });
  }

});
app.post('/save', (req, res) => {

  // only exccepts array of strings like so: ['124125125.svg', ...]

  if (typeof req.body !== typeof []) {
    // TODO: debug: `req.body is of type "${typeof req.body}" but should be of type "${typeof []}"`
    res.status(500).json({ success: false, msg: 'an error has aqqured' }); // TODO: ast
  }

  for (let elm of req.body) {
    
    if (typeof elm !== typeof '') {
      // TODO: debug: `"${elm}" is of wrong format`
      res.status(500).json({ success: false, msg: 'an error has aqured' }); // TODO: ast
    }
    if (!/\d*.svg/.test(elm)) {
      // TODO: debug: `"${elm}" is of wrong format`
      res.status(500).json({ success: false, msg: 'an error has aqured' }); // TODO: ast
    }

    // copy files from tmp to latex
    fs.copyFile(`tmp/${elm}`, `latex/${elm}`, (err) => {
      if (err) {
        for (let subElm of req.body) {
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


function compile(content = '', outputSvgFileNoExtNoPath) {

  // output guaranteed to be of the type { exitCode: uint, msg: string }
  // usefull: res.stderr, res.stdout, res.error.message

  // exitCodes:
  // 0 - success
  // 1 - latex compiled with errors and errors successfully read
  // 2 - arg[1] not string or empty
  // 3 - spawnSync failure
  // 4 - spawnSync returned nonzero exit code
  // 5 - cant read latex log

  if (!outputSvgFileNoExtNoPath || typeof outputSvgFileNoExtNoPath !== 'string') {
    return {
      exitCode: 2,
      msg: `"outputSvgFileNoExtNoPath" should be string but is "${typeof outputSvgFileNoExtNoPath}"`
    };
  }

  let res = {};

  try {
    res = spawnSync("./compile.bash", [`${content}`, outputSvgFileNoExtNoPath]) || {};
  } catch (error) {
    return { exitCode: 3, msg: error } // dont give error info of spawnSync in anny responce, only internal
  }

  const output = `${res.stderr.toString()}\n${res.stdout.toString()}`;
  console.log(output); // TODO: comment this in production

  if (res.status === 124) return { exitCode: 1, msg: "latex compilation tymeout" };
  else if (res.status === 249) return { exitCode: 4, msg: output }; // TODO: find exit code

  else if (res.status) { // error accured, read latex log
    try {
      const errors = fs.readFileSync(file_latex_log, 'utf-8').match(/!.*|l\..*/gm);
      return { exitCode: 1, msg: errors.join('\n').replace(/\n+/g, "\n") };
    } catch (error) {
      return { exitCode: 5, msg: output };
    }
  }

  else return { exitCode: 0, msg: "" };

}
