const Client = require('ssh2').Client;

const filename = '/sw/logs/tomcat/catalina.out';
const username = 'logger';
const passphrase = 'logger';
const serverDomain = 'objectbrains.com';
const logger_rsa = '/Users/huypham/.ssh/logger_rsa';

let conn = new Client();

module.exports = app => {
  app.get('/api/getLog/:serverName', (req, res) => {
    const serverName = req.params.serverName;

    // Define function for ready event
    conn = conn.once('ready', () => {
      console.log(`Successfully connected to ${serverName}`);

      // Define command to be run on the given server
      let cmd = `tail ${filename}`;

      // Run the command on the given server
      conn.exec(cmd, (err, stream) => {
        if (err) {
          console.log('error =', err.message);
          return;
        }
        stream.on('data', data => {
          res.send(data);
          conn.end();
          console.log(`Successfully disconnected to ${serverName}`);
        })
      });
    });

    // Connect to the server
    console.log(`Connecting to server ${serverName}`);
    conn.connect({
      host: `${serverName}.${serverDomain}`,
      username: username,
      passphrase: passphrase,
      privateKey: require('fs').readFileSync(logger_rsa)
    });
  });

  app.get('/api/followLog/:serverName', (req, res) => {
  });
}