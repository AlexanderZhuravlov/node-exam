import got from 'got';
import cheerio from 'cheerio';
import co from 'co';
import queue from 'queue';
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
      .catch((error) => {
        reject(error);
      });
  });
}


function parseHTML(data, element) {
  return new Promise((resolve, reject) => {
    let { outputHTML, output_URLS } = [];
    try {
      const parser = cheerio.load(data);

      parser(element).each(function () {
        const elem = parser(this);

        outputHTML.push(elem.html());

      });
      resolve({ outputHTML, output_URLS });
    } catch (err) {
      reject(err);
    }
  });
}

function findAllURLS(html){
  return new Promise((resolve, reject) => {


  });
}

function scrapHTML(params) {
  const { url, element, level } = params;
  let currentLevel = 0;
  return co(function* () {
    // First Iteration
    const html = yield getSiteHTML(url);
    const { outHTML, outURLS } = yield parseHTML(html, element);







    return parsedHTML;
  })
  .catch((error) => { throw new Error(error); });
}

module.exports = {
  scrapHTML,
};
