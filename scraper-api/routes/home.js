/**
 * Require modules
 */
import express from 'express';
const router = express.Router();

/**
 * GET home page.
 */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'API Home Page' });
});

module.exports = router;
