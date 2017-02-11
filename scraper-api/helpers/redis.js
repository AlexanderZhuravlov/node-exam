import redis from 'redis';
import config from '../config';
const client = redis.createClient(config.REDIS_PORT, config.REDIS_HOST);

function writeToRedis() {
  
}

function searchKeys() {
  
}

function updateKey() {

}

module.exports = {
  writeToRedis,
  searchKeys,
  updateKey,
};
