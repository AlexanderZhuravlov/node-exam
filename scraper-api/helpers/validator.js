import validator from 'validator';
import errors from '../config/errors';
import config from '../config';
import { getDomain } from '../helpers/general';

function validateParams(params) {
  return new Promise((resolve, reject) => {
    let { url, element, level } = params;
    level = level || config.DEFAULT_SEARCH_LEVEL;

    if (!url || !element) reject(errors.missingParams);
    if (!validator.isURL(url)) reject(errors.errorUrlParam);
    if (!validator.isAlphanumeric(element)) reject(errors.errorElementParam);
    if (!validator.isInt(level)) reject(errors.errorLevelParam);

    resolve({ url, element, level });
  });
}

function validateURL(url, domain) {
  if (typeof (url) === 'string' && validator.isURL(url) && getDomain(url) !== domain) return true;
  return false;
}

module.exports = {
  validateParams,
  validateURL,
};
