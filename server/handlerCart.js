const cart = require('./cart');
const fs = require('fs');

const actions = {
  add: cart.add,
  change: cart.change,
  remove: cart.remove,
  clear: cart.clear,
};

const handlerCart = (req, res, action, file) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      res.sendStatus(404, JSON.stringify({result: 0, text: err}));
    } else {
      const newCart = actions[action](JSON.parse(data), req);
      fs.writeFile(file, newCart, (err) => {
        if (err) {
          res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
          res.send({result: 1, text: 'Success!'});
        }
      })
    }
  })
};

module.exports = handlerCart;