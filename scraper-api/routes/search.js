/**
 * Require modules
 */
import express from 'express';
const router = express.Router();


router.get('/', function(req, res, next) {

  console.log(req.params);

  res.json({endpoint: 'GET search', prms: req.params });
});

router.get('/list', function(req, res, next) {
  res.json({endpoint: 'GET search list', params: req.params});
});

router.delete('/', function(req, res, next) {
  res.json({endpoint: 'DELETE search', params: req.params});
});

module.exports = router;
