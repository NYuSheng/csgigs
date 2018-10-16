const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express again' });
});

app.use(express.static(path.join(__dirname, './public')));

app.listen(port, () => console.log(`Listening on port ${port}`));
