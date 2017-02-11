import got from 'got';
import htmlparser from 'htmlparser2';
import cheerio from 'cheerio';
import co from 'co';

function getSiteHTML(url) {
  return new Promise((resolve, reject) => {
    got(url)
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        reject(error.response.body);
      });
  });
}

function parseHTML(data, element) {
  return new Promise((resolve, reject) => {
    let output = [];
    const parser = cheerio.load(data);

    parser(element).each(function() {
      const elem = parser(this);
      console.log(elem.html());
      output.push(elem.html());
    });

    resolve(output);

    /*let output = [];
    const handler = new htmlparser.DomHandler( (error, dom) => {
      if (error) reject(err);

      let html = dom


      //output.push(dom);
      console.log(dom);
    });
    const parser = new htmlparser.Parser(handler);
    parser.write(data);
    parser.onend(resolve(output));
    parser.onerror((err) => {
      reject(err);
    });
    parser.done();*/


    /*let output = [];
    let flag = false;

    const parser = new htmlparser.Parser({
      onopentag: (name) => {
        if (name === element) flag = true;
      },
      ontext: (text) => {
        output.push(text);
      },
      onclosetag: (tagname) => {
        if (tagname === element) flag = false;
      },
    }, { decodeEntities: true });
    parser.write(data);
    parser.onend(resolve(output));
    parser.onerror((err) => {
      reject(err);
    });*/
  });
}

function getLinksFromHTML(html, level) {
  return new Promise((resolve, reject) => {


  });
}

function scrapHTML(params) {
  const { url, element, level } = params;
  return co(function* () {
    const html = yield getSiteHTML(url);
    const parsedHTML = yield parseHTML(html, element);




    return parsedHTML;
  })
  .catch((error) => { throw new Error(error); });
}

module.exports = {
  scrapHTML,
};
