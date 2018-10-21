const Client = require('ssh2').Client;

const username = 'logger';
const passphrase = 'logger';
const password = 'logger';
const serverDomain = 'objectbrains.com';
const logger_rsa = '/Users/huypham/.ssh/logger_rsa';
const LOG_SIZE = 100;

// Define servers and connections
const serverNames = [
  'app-sti',
  'app-sti2',
  'qa-sti',
  'localhost'
]

const conns = serverNames.reduce((result, server) => {
  result[server] = new Client();
  return result;
}, {})

// Init connections
for (let serverName in conns) {
  connectServer(conns[serverName], serverName);
}

// A function to connect to a server
function connectServer(conn, serverName) {
  // On ready event
  conn.on('ready', () => {
    console.log(`Connected to ${serverName} successfully`);
  });

  // On error event
  conn.on('error', () => {
    console.log(`Failed to connect to ${serverName}`);
  });

  // On end event
  conn.on('end', () => {
    console.log(`Disconnected to ${serverName} successfully`);
  })

  // Connect to the server
  console.log(`Connecting to server ${serverName}`);
  try {
    if (serverName != 'localhost') {
      conn.connect({
        host: `${serverName}.${serverDomain}`,
        username: username,
        passphrase: passphrase,
        privateKey: require('fs').readFileSync(logger_rsa),
      });
    } else {
      conn.connect({
        host: serverName,
        username: username,
        password: password
      });
    }
  } catch {
    console.log(`Error connecting to ${serverName}`);
  }
}

module.exports = app => {
  app.get('/api/getLog/:serverName/:flags?', (req, res) => {
    const serverName = req.params.serverName;
    const conn = conns[serverName];
    const flags = req.params.flags ? req.params.flags.split(',') : [];
    let filename = serverName == 'localhost' ? 'log' : '/sw/logs/tomcat/catalina.out';

    // Define command to be run on the given server
    let cmd = `tail -n ${LOG_SIZE} ${filename}`;
    for (let flag of flags) {
      cmd += ` | grep -v ${flag}`;
    }

    // Run the command on the given server
    try {
      conn.exec(cmd, (err, stream) => {
        if (err) {
          res.send(`Unable to get the log.\n${err.message}`);
          console.log(`Unable to get the log.\n${err.message}`);
          return;
        }
        stream.on('data', data => {
          res.write(data);
        });
        stream.on('close', () => {
          res.end();
        });
      });
    } catch (err) {
      res.send(`Server ${serverName} is down. Please try again later...`);
      console.log(`Server ${serverName} is down. Trying to reconnect...`);
      connectServer(conn, serverName);
    }
  });

  app.get('/api/followLog/:serverName/:flags?', (req, res) => {
    const conn = conns[req.params.serverName];
    const flags = req.params.flags ? req.params.flags.split(',') : [];
    let filename = serverName == 'localhost' ? 'log' : '/sw/logs/tomcat/catalina.out';

    // Define command to be run on the given server
    let cmd = `tail -n ${LOG_SIZE} -f ${filename}`;
    for (let flag of flags) {
      cmd += ` | grep -v ${flag}`;
    }

    // Run the command on the given server
    try {
      conn.exec(cmd, (err, stream) => {
        if (err) {
          res.send(`Unable to get the log.\n${err.message}`);
          console.log(`Unable to get the log.\n${err.message}`);
          return;
        }

        try {
          stream.stdout.pipe(res);
        } catch (err) {
          res.end();
        }

        // Define function for unfollow event
        conn.once('unfollow', () => {
          res.end();
        });
      });
    } catch (err) {
      res.send(`Server ${serverName} is down. Please try again later...`);
      console.log(`Server ${serverName} is down. Trying to reconnect...`);
      connectServer(conn, serverName);
    }

  });

  app.get('/api/stopLog/:serverName', (req, res) => {
    const conn = conns[req.params.serverName];
    conn.emit('unfollow');
    res.end();
  });
}