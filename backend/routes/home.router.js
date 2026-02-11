const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Welcome to Festofy Home!');
});

module.exports = router;