import redis from 'redis';
import bluebird from 'bluebird';
import hash from 'object-hash';
import config from '../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let redisClientInstance;

function redisClient() {
  return new Promise((resolve, reject) => {
    if (redisClientInstance && redisClientInstance.connected) {
      return resolve(redisClientInstance);
    }
    const client = redis.createClient(config.REDIS_PORT, config.REDIS_HOST);
    client.on('error', reject);
    client.on('connect', () => {
      redisClientInstance = client;
      return resolve(client);
    });
  });
}


function* searchInList(params) {
  const client = yield redisClient();
  const paramsHash = hash(params);
  const result = yield client.getAsync(paramsHash)
    .then(res => res);

  return result;
}

function* setInList(params, data = '') {
  const client = yield redisClient();
  const paramsHash = hash(params);
  const result = yield client.setAsync(paramsHash, JSON.stringify(params), 'NX', 'EX', config.REDIS_SESSION_EXPIRE)
    .then(res => res);

  return result;
}

module.exports = {
  searchInList,
  setInList,
};
