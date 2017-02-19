# Node Exam

## Scraper API
Install API

    npm install
    
Start app

    npm start
    
##### TODO
1) Add handler to check instance of error
2) recurseGetData - improvements needed, such as - save to redis partially, improve logic for getting level data
3) Add filter for already parsed urls
4) Swagger
5) Add more tests

## CLI app for Scraper API

Install tool

    npm install
    
Before using tool need to link it

    npm link
    
Using tool

    scraper -u http://stackoverflow.com -l 1 -e h3

##### TODO
1) Add progress bar
2) Add more tests
