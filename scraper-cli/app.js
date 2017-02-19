#!/usr/bin/env node

/*
  The shebang (#!) at the start means execute the script with what follows.
  /bin/env looks at your current node environment.
  Any argument to it not in a 'name=value' format is a command to execute.
*/

const command = require('commander');
const request = require('request');
const messages = require('./config/messages');
const config = require('./config');

command
  .version('1.0.0')
  .option('-u, --url <url>', 'Url for scrapping')
  .option('-e, --element <element>', 'Scrapping element')
  .option('-l, --level <level>', 'Level of scrapping')
  .parse(process.argv);

if (!command.url || command.url === 'undefined') {
  console.log(messages.specifyURL);
  process.exit(1);
}

if (!command.element || command.element === 'undefined') {
  console.log(messages.specifyElement);
  process.exit(1);
}

// TODO: add progress bar
// HTTP request for scrapper API
const searchParams = { url: command.url, element: command.element };
if (command.level && command.level !== 'undefined') {
  searchParams.level = command.level;
}
request({ url: config.scraperApiUrl, qs: searchParams }, (err, response, body) => {
  if (err) {
    console.error(messages.serverResponseError, err);
    process.exit(1);
  }
  console.log("Get response: " + response.statusCode);
  console.log(body);
  process.exit(0);
});
