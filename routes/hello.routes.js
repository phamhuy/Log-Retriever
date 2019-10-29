const { exec } = require('child_process');

module.exports = app => {
  app.get('/hello', (req, res) => {
    console.log("Hi");
    let cmd = "cd /Volumes/unix/workplace/PaprikaIngestion/src/PaprikaSynonymGenerator/build/bin"
    cmd += ' && brazil-runtime-exec SynonymGeneratorRunner.sh huy'
    exec(cmd, (err, stdout, stderr) => {
      console.log(stderr);
      console.log(err);
      res.send(stdout);
    });
  });
}