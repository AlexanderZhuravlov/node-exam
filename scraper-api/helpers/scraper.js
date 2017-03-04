import got from 'got';
import cheerio from 'cheerio';
import co from 'co';
import Q from 'q';
import { validateURL, checkResponse } from '../helpers/validator';
import { getDomain } from '../helpers/general';
import log from '../helpers/logger';

// Keep it simple
function getSiteHTML(url) {
  return got(url)
    .then(response => checkResponse(response) && response.body);
}

function findAllURLS(html, domain) {
  // The errror will be thrown anyway, here was useless try-catch
  const linksArray = [];
  const parser = cheerio.load(html);
  parser('a').each(function () {
    const elem = parser(this);
    const href = elem.attr('href');
    if (validateURL(href, domain)) {
      linksArray.push(href);
    }
  });
  return linksArray;
  // You can concat empty Arrays, no need to use null check here at all
}

function parseHTML(data = '', element, domain) {
  return new Promise((resolve, reject) => {
    const outputHTML = [];
    let outputURLS = [];
    const parser = cheerio.load(data);
    parser(element).each(function () {
      const elem = parser(this);
      if (elem.html() !== '') outputHTML.push(elem.html());
      const links = findAllURLS(elem.html(), domain);
      outputURLS = outputURLS.concat(links);
      // You can concat empty Arrays, no need to use null check here at all
    });
    console.log(outputURLS);
    console.log(outputHTML);
    outputURLS = Array.from(new Set(outputURLS));
    resolve({ outputHTML, outputURLS });
    // here was useless try-catch
  });
  // here was redundant code
}

// Keep it simple
function levelData(urls, element, domain) {
  const promises = urls.map(url => getSiteHTML(url));
  return Q.allSettled(promises)
    .then(settledHTML => Promise.all(
      settledHTML.map(result =>
        result.state === 'fulfilled' && parseHTML(result.value, element, domain))
    ));
}

// TODO: improvements needed, such as - save to redis partially, improve logic for level data
function* recurseGetData(limit, count = 0, urls, element, domain, output = []) {
  if (count < limit) {
    const lvlData = yield levelData(urls, element, domain);
    log.info(lvlData);
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
    // Write logs instead of comments
    if (outputURLS.length > 0 && outputHTML.length > 0) {
        const innerHTML = yield* recurseGetData(level, 0, outputURLS, element, domain);
        if (innerHTML.length > 0) outputHTML = outputHTML.concat(innerHTML);
    }

    return outputHTML;
  });
  // here was redundant code
}

module.exports = {
  scrapHTML,
};
