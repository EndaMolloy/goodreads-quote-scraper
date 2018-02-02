//https://segment.com/blog/ui-testing-with-nightmare/

const Nightmare = require('nightmare');
const expect = require('chai').expect; // jshint ignore:line
const quotes = require('../index');

describe('Load a Page', function() {
  // Recommended: 5s locally, 10s to remote server, 30s from airplane ¯\_(ツ)_/¯
  this.timeout('20s')
  const author = "George Bernard Shaw";

  let nightmare = null
  beforeEach(() => {
    nightmare = new Nightmare()
  })

  describe('go to goodreads webpage', () => {
    it('should load without error', done => {
      nightmare.goto('https://www.goodreads.com/quotes/search?utf8=%E2%9C%93&q=seneca&commit=Search')
        .end()
        .then(function (result) { done() })
        .catch(done)
    })
  })

  describe('go to goodreads search page with chosen author', () => {
    it('should load without error', done => {
      nightmare.goto('https://www.goodreads.com/quotes/search?utf8=%E2%9C%93&q='+author+'&commit=Search')
        .end()
        .then(function (result) { done() })
        .catch(done)
    })

    it('should return an array of quotes', done => {
      nightmare.goto('https://www.goodreads.com/quotes/search?utf8=%E2%9C%93&q='+author+'&commit=Search')
        .evaluate(function () {
          return Array.from(document.querySelectorAll('.quoteText')).map(element => element.innerText)
        })
        .end()
        .then(function (result) {
          expect(result).to.have.length(20)
          done()
        })
        .catch(done)
    })

    it('should return an array of quotes', done => {
      nightmare.goto('https://www.goodreads.com/quotes/search?commit=Search&page=1&utf8=%E2%9C%93&q='+author)
        .evaluate(function () {
          return Array.from(document.querySelectorAll('.quoteText')).map(element => element.innerText)
        })
        .end()
        .then(function (result) {
          expect(result).to.have.length(20)
          done()
        })
        .catch(done)
    })

    it('should loop through pages and add quotes to array', done => {
      let array = [];

      while(array.length<5){
        let pageNum = 1;

        nightmare.goto('https://www.goodreads.com/quotes/search?commit=Search&page='+pageNum+'&utf8=%E2%9C%93&q='+author)
          .evaluate(function () {
            return Array.from(document.querySelectorAll('.quoteText')).map(element => element.innerText)
          })
          .end()
          .then(function (result) {
            array.push(result);
            expect(result).to.have.length(20)
            done()
          })
          .catch(done)
      }

    })

  })

})
