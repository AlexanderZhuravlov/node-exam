import got from 'got';
import cheerio from 'cheerio';
import co from 'co';
import Q from 'q';
import { validateURL, checkResponse } from '../helpers/validator';
import { getDomain } from '../helpers/general';
import log from '../helpers/logger';

function getSiteHTML(url) {
  return new Promise((resolve, reject) => {
    got(url)
      .then((response) => {
        console.log('processed', url, response.statusCode);
        if (!checkResponse(response)) {
          log.info('scrapper - getSiteHTML - checkResponse error');
          resolve();
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

function parseHTML(data = '', element, domain) {
  return new Promise((resolve, reject) => {
    const outputHTML = [];
    let outputURLS = [];
    try {
      const parser = cheerio.load(data);
      parser(element).each(function () {
        const elem = parser(this);
        if (elem.html() !== '') outputHTML.push(elem.html());
        const links = findAllURLS(elem.html(), domain);
        if (Array.isArray(links)) outputURLS = outputURLS.concat(links);
      });
      outputURLS = Array.from(new Set(outputURLS));
      resolve({ outputHTML, outputURLS });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  }).then(
    result => { return result; },
    error => { throw error; },
    );
}

function levelData(urls, element, domain) {
  return co(function* () {
    const settledHTML = yield Q.allSettled(urls.map(url => { return getSiteHTML(url); }));

    const parsedData = yield settledHTML.map(result => {
      if (result.state === 'fulfilled') {
        return parseHTML(result.value, element, domain)
          .then(output => { return output; })
          .catch(error => { throw error; });
      }
      // Need add logger
      return [];
      //throw result.reason;
    });
    return parsedData;
  })
  .catch(error => { throw error; });
}

// TODO: improvements needed, such as - save to redis partially, improve logic for level data
function* recurseGetData(limit, count = 0, urls, element, domain, output = []) {
  if (count < limit) {
    const lvlData = yield levelData(urls, element, domain);
    log.info(lvlData);
    if (Array.isArray(lvlData)) {
      let lvlHtml = [];
      let lvlUrls = [];
      lvlData.forEach(item => {
        if ('outputURLS' in item && 'outputHTML' in item) {
          if (item.outputURLS.length > 0) lvlUrls = lvlUrls.concat(item.outputURLS);
          if (item.outputHTML.length > 0) lvlHtml = lvlHtml.concat(item.outputHTML);
        }
      });
      // TODO: Add filter for already parsed urls
      lvlUrls = Array.from(new Set(lvlUrls));
      if (lvlUrls.length > 0) {
        const out = output.concat(lvlHtml);
        return yield* recurseGetData(limit, count + 1, lvlUrls, element, domain, out);
      }
      return output;
    }
    return output;
  }
  return output;
}

function scrapHTML(params) {
  const { url, element, level } = params;
  const domain = getDomain(url);
  return co(function* () {
    // First Iteration
    const html = yield getSiteHTML(url);
    let { outputHTML, outputURLS } = yield parseHTML(html, element, domain);

    // Levels queue
    if (outputURLS.length > 0 && outputHTML.length > 0) {
        const innerHTML = yield* recurseGetData(level, 0, outputURLS, element, domain);
        if (innerHTML.length > 0) outputHTML = outputHTML.concat(innerHTML);
    }
    return outputHTML;
  })
  .catch(error => { throw error; });
}

module.exports = {
  scrapHTML,
};
