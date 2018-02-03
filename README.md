# goodreads-quote-scraper

A nightmarejs based webscraper for collecting quotes of a given author from [goodreads.com](https://www.goodreads.com/quotes/search?utf8=%E2%9C%93&q=george+bernard+shaw&commit=Search). The quotes are then saved as a prettified json file in your root directory.

The quotes are ordered as on goodreads i.e. most liked first. Only quotes attributed to the author are written to the final file.




# Installation
```
npm install --save goodreads-quote-scraper
```
Note: electron can take some time to download.

[![NPM](https://nodei.co/npm/goodreads-quote-scraper.png)](https://nodei.co/npm/goodreads-quote-scraper/)

# Usage
The API takes three arguments, the third being optional.
1. [string] - The author who's quotes you wish to scrape
2. [Number] - The number of pages you wish to scrape (Goodreads has 20 quotes per page).
3. [Boolean] - Whether or not you want the electron instance to show. Default is false.

```javascript
//index.js

const goodreads = require('goodreads-quote-scraper');

goodreads('george bernard shaw', 2, true);
```
To batch quote scraping from a number of authors

```javascript
getQuotes();

async function getQuotes(){
  try{
    await goodreads('ralph waldo emerson', 2);
    await goodreads('mark twain', 5);
    await goodreads('harper lee', 1);
  }
  catch(err){
    console.log(err);
  }
}
```

# Output
A message is logged to the console when the file has been written
```
george bernard shaw is complete!
```

```
├── node_modules
├── index.js
├── george-bernard-shaw.json
```

```javascript
//george-bernard-shaw.json

[
    {
        "quote": "Life isn't about finding yourself. Life is about creating yourself.",
        "author": "George Bernard Shaw"
    },
    {
        "quote": "Make it a rule never to give a child a book you would not read yourself.",
        "author": "George Bernard Shaw"
    },
    ...
```
