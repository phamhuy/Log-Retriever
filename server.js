const express = require('express');
const app = express();

// Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, tokenkey, username");
  next();
});

// Routes
// require('./routes/log.routes')(app);
// require('./routes/hello.routes')(app);

// Render
const path = require('path');
app.use(express.static('dist/browser'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'browser', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});