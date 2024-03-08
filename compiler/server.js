const express = require('express');
const bodyParser = require('body-parser');
const { spawnSync } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3002;

const file_latex_log = '/tmp/texput.log';

app.use(bodyParser.text());
app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}/`); });


app.post('/', (req, res) => {

  const outputSvgFileNoExtNoPath = `${new Date().getTime()}`;

  const result = compile(req.body, outputSvgFileNoExtNoPath);

  if (!result.success) {
    res.status(500).json({ success: false, msg: result.msg });
  } else {
    res.status(200).send({ success: true, outputSvgFileNoExtNoPath });
  }

});

function compile(content = '', outputSvgFileNoExtNoPath) {

  // output guaranteed to be of the type { success: bool, msg: string }
  // usefull: res.stderr, res.stdout, res.error.message

  if (!outputSvgFileNoExtNoPath || typeof outputSvgFileNoExtNoPath !== 'string') {
    return {
      success: false,
      msg: `"outputSvgFileNoExtNoPath" should be string but is "${typeof outputSvgFileNoExtNoPath}"`
    };
  }

  let res = {};

  try {
    res = spawnSync("./compile.bash", [`${content}`, outputSvgFileNoExtNoPath]) || {};
  } catch {
    return { success: false, msg: "execution failure" } // dont give error info of spawnSync
  }

  if (res.status === 124) return { success: false, msg: "latex compilation tymeout" };
  else if (res.status === 249) return { success: false, msg: "execution returned non zero exit code" }; // dont give exit code

  else if (res.status) { // error accured, read latex log
    try {
      const errors = fs.readFileSync(file_latex_log, 'utf-8').match(/!.*|l\..*/gm);
      return { success: false, msg: errors.join('\n').replace(/\n+/g, "\n") };
    } catch (error) {
      return { success: false, msg: "error reading latex log" };
    }
  }

  else return { success: true, msg: "" };

}
