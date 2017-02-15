import got from 'got';
import cheerio from 'cheerio';
import co from 'co';
import queue from '../helpers/queue';
import { validateURL } from '../helpers/validator';
import { getDomain } from '../helpers/general';
import config from '../config';
import errors from '../config/errors';

function checkResponse(response) {
  // Get response content-type
  let contentType = response.headers['content-type'];
  contentType = contentType.split(';')[0];

  if (config.ACCEPTABLE_CONTENT_TYPES.indexOf(contentType) !== -1
    && response.statusMessage === config.ACCEPTABLE_STATUS_MESSAGE
    && response.statusCode === config.ACCEPTABLE_STATUS_CODE) {
    return true;
  }
  return false;
}

function getSiteHTML(url) {
  return new Promise((resolve, reject) => {
    got(url)
      .then((response) => {
        if (!checkResponse(response)) {
          reject(errors.notAcceptableResponse);
        }
        resolve(response.body);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function findAllURLS(html, domain) {
  try {
    const linksArray = [];
    const parser = cheerio.load(html);
    parser('a').each(function () {
      const elem = parser(this);
      const href = elem.attr('href');
      if (validateURL(href, domain)) {
        linksArray.push(href);
      }
    });
    if (linksArray.length > 0) return linksArray;
    return null;
  } catch (err) {
    throw err;
  }
}

function parseHTML(data, element, domain) {
  return new Promise((resolve, reject) => {
    const outputHTML = [];
    let outputURLS = [];
    try {
      const parser = cheerio.load(data);
      parser(element).each(function () {
        const elem = parser(this);
        outputHTML.push(elem.html());
        const links = findAllURLS(elem.html(), domain);
        if (Array.isArray(links)) outputURLS = outputURLS.concat(links);
      });
      outputURLS = Array.from(new Set(outputURLS));
      resolve({ outputHTML, outputURLS });
    } catch (err) {
      reject(err);
    }
  }).then(
    result => { return result; },
    error => { throw error; },
    );
}

function scrapHTML(params) {
  const { url, element, level } = params;
  let currentLevel = 0;
  const domain = getDomain(url);
  return co(function* () {
    // First Iteration
    const html = yield getSiteHTML(url);
    const parsedHTML = yield parseHTML(html, element, domain);

    return parsedHTML;
  })
  .catch(error => { throw error; });
}

module.exports = {
  scrapHTML,
};
