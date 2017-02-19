/**
 * Require modules
 */
import express from 'express';
import co from 'co';
import { validateParams } from '../helpers/validator';
import redisClient from '../helpers/redis';
import { scrapHTML } from '../helpers/scraper';
import errors from '../config/errors';
const router = express.Router();

/**
 * GET /api/search/?url=https%3A%2F%2Fgoogle.com&element=h2&level=3
 */
router.get('/', (req, res, next) => {
  co(function* () {
    let output;
    // Validate params
    const params = yield validateParams(req.query);

    // Check if result available into Redis
    const redisSearchResults = yield redisClient.searchInList(params);
    if (redisSearchResults !== null) {
      // If result available into redis
      output = yield redisClient.getSearchResult(params);
    }
    if (!output || output === 'undefined') {
      // If result not available into redis
      // - run scraper
      output = yield scrapHTML(params);
      // - save result to redis
      yield redisClient.saveInRedis(params, output);
    }
    // Output results
    res.json({ output });
  })
  .catch(error => next({ message: error }));
});

/**
 * GET /api/search/list
 */
router.get('/list', (req, res, next) => {
  co(function* () {
    // Get search results
    const result = yield redisClient.getAllSearch();
    res.json(result);
  })
    .catch(error => next({ message: error }));
});

/**
 * DELETE /api/search/?url=https%3A%2F%2Fgoogle.com&element=h2&level=3
 */
router.delete('/', (req, res, next) => {
  co(function* () {
    // Validate params
    const params = yield validateParams(req.query);
    // Remove result from redis
    const result = yield redisClient.deleteSearchResult(params);
    // Handle result for errors
    if (!result) res.status(404).json({ message: errors.searchResultsNotFound });
    res.json({ message: 'Success' });
  })
    .catch(error => next({ message: error }));
});

module.exports = router;
