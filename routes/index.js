var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { lang: re.lang});
});
router.get('/ar', function(req, res) {
  res.render('index', { lang:'ar' });
});
router.get('/fr', function(req, res) {
  res.render('index', { 'lang':'fr' });
});

module.exports = router;
