// Modules
const express = require('express');
const app = express();

//Constants / Variables
const port = process.env.PORT || 8080;

// Middleware
app.use(express.static('public'));

// Server Funcationality

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})