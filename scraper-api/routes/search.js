/**
 * Require modules
 */
import express from 'express';
import co from 'co';
import { validateParams } from '../helpers/validator';
import redis from '../helpers/redis';
import { scrapHTML } from '../helpers/scraper';
const router = express.Router();

/**
 * GET /api/search/?url=https%3A%2F%2Fgoogle.com&element=h2&level=3
 */
router.get('/', (req, res, next) => {
  co(function* () {
    // Validate params
    const params = yield validateParams(req.query);

    // Check if result available into Redis
    //console.log(key);

    // Scrap HTML
    const scrappedHTML = yield scrapHTML(params);


    // Save result to Redis

    // Output result
    res.json({ endpoint: 'GET search', prms: params, out: scrappedHTML });
  })
  .catch(error => next({ message: error }));
});

/**
 * GET /api/search/list
 */
router.get('/list', (req, res, next) => {
  res.json({ endpoint: 'GET search list', params: req.params });
});

/**
 * DELETE /api/search/?url=https%3A%2F%2Fgoogle.com&element=h2&level=3
 */
router.delete('/', (req, res, next) => {
  res.json({ endpoint: 'DELETE search', params: req.params });
});

module.exports = router;
