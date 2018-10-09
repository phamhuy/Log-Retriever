const express = require('express');
const app = express();

// Routes
require('./routes/log.routes')(app);

// Render
const path = require('path');
app.use(express.static('dist/logger'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'logger', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});