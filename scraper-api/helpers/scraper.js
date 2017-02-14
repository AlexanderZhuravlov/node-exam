import got from 'got';
import cheerio from 'cheerio';
import co from 'co';
import queue from '../helpers/queue';
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

function findAllURLS(html) {
  // TODO: add separate function and rebuild to Promises.all
  try {
    let linksArray = [];
    const parser = cheerio.load(html);
    parser('a').each(function () {
      const elem = parser(this);
      console.log(elem.attr('href'));
      linksArray.push(elem.attr('href'));
    });
    return linksArray;
  } catch (err) {
    throw err;
  }
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
      .catch((error) => {
        reject(error);
      });
  });
}


function parseHTML(data, element) {
  return new Promise((resolve, reject) => {
    let outputHTML = [];
    let outputURLS = [];

    // TODO: add separate function and rebuild to Promises.all
    try {
      const parser = cheerio.load(data);
      parser(element).each(function () {
        const elem = parser(this);
        outputHTML.push(elem.text());
        outputURLS.push(findAllURLS(elem.html()));
      });
      resolve({ outputHTML, outputURLS });
    } catch (err) {
      reject(err);
    }

  });
}

function scrapHTML(params) {
  const { url, element, level } = params;
  let currentLevel = 0;
  return co(function* () {
    // First Iteration
    const html = yield getSiteHTML(url);
    const { outHTML, outURLS } = yield parseHTML(html, element);

    console.log(outURLS);

    return outURLS;
  })
  .catch((error) => { throw error; });
}

module.exports = {
  scrapHTML,
};
