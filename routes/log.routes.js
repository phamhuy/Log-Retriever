const Client = require('ssh2').Client;

const filename = '/sw/logs/tomcat/catalina.out';
const username = 'logger';
const passphrase = 'logger';
const serverDomain = 'objectbrains.com';
const logger_rsa = '/Users/huypham/.ssh/logger_rsa';

const LOG_SIZE = 30;

// Define servers and connections
const serverNames = [
  'app-sti',
  'app-sti2',
  'qa-sti'
]

const conns = serverNames.reduce((result, server) => {
  result[server] = (new Client());
  return result;
}, {})

// Init connections
for (let serverName in conns) {
  const conn = conns[serverName];

  // On ready event
  conn.on('ready', () => {
    console.log(`Connected to ${serverName} successfully`);
  });

  // On end event
  conn.on('end', () => {
    console.log(`Disconnected to ${serverName} successfully`);
  })

  // Connect to the server
  console.log(`Connecting to server ${serverName}`);
  conn.connect({
    host: `${serverName}.${serverDomain}`,
    username: username,
    passphrase: passphrase,
    privateKey: require('fs').readFileSync(logger_rsa)
  });
}

module.exports = app => {
  app.get('/api/getLog/:serverName/:flags?', (req, res) => {
    const conn = conns[req.params.serverName];
    const flags = req.params.flags ? req.params.flags.split(',') : [];

    // Define command to be run on the given server
    let cmd = `tail -n ${LOG_SIZE} ${filename}`;
    for (let flag of flags) {
      cmd += ` | grep -v ${flag}`;
    }

    // Run the command on the given server
    conn.exec(cmd, (err, stream) => {
      if (err) {
        res.send(err.message);
        return;
      }
      stream.once('data', data => {
        res.send(data);
      })
    });
  });

  app.get('/api/followLog/:serverName/:flags?', (req, res) => {
    const conn = conns[req.params.serverName];
    const flags = req.params.flags ? req.params.flags.split(',') : [];

    // Define command to be run on the given server
    let cmd = `tail -n ${LOG_SIZE} -f ${filename}`;
    for (let flag of flags) {
      cmd += ` | grep -v ${flag}`;
    }

    // Run the command on the given server
    conn.exec(cmd, (err, stream) => {
      if (err) {
        res.send(err.message);
        return;
      }

      try {
        stream.stdout.pipe(res);
      } catch(err) {
        res.end();
      }
    });

    // Define function for unfollow event
    conn.once('unfollow', () => {
      res.end();
    });
  });

  app.get('/api/stopLog/:serverName', (req, res) => {
    const conn = conns[req.params.serverName];
    conn.emit('unfollow');
    res.end();
  });
}