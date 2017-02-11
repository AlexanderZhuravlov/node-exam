/**
 * Require modules
 */
import express from 'express';
const router = express.Router();

/**
 * GET home page.
 */
router.get('/', function(req, res, next) {
  res.send('<html><body><h1>My web app http API!</h1></body></html>');
  //res.render('index', { title: 'some title' , products: products.productsArray});
});

module.exports = router;
