const express = require('express');
const fs = require('fs');
const routerCart = require('./routerCart');
const app = express();

app.use(express.json());
app.use('/', express.static('public'));
app.use('/api/cart', routerCart);

app.get('/api/catalog', (req, res) => {
  fs.readFile('server/db/catalog.json', 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      res.send(data);
    }
  })
});

app.listen(3000, () => console.log('Listen on port 3000...'));