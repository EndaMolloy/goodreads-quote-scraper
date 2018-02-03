const Nightmare = require('nightmare');
const fs = require('fs');

module.exports = async function(author,pages,status) {

  try{

    if(!status)
      status = false;

    const nightmare = Nightmare({show:status}),
        MAX_PAGE = pages || 100;
    let currentPage = 1,
        nextExists = true,
        array = [];

    await nightmare
        .goto('https://www.goodreads.com/quotes/search?utf8=✓&commit=Search&q='+author)
        .wait('body')

    nextExists = await nightmare.visible('.next_page');
    while (nextExists && currentPage <= MAX_PAGE) {
        array.push(await nightmare
            .evaluate(function() {
              return Array.from(document.querySelectorAll('.quoteText')).map(element => element.innerText)
            })
          );

        await nightmare
            .click('.next_page')
            .wait('body')

        currentPage++;
        nextExists = await nightmare.visible('.next_page');
    }

    await nightmare.end();

    const finalArray = await processArray(array, author)
    const formatAuthor = author.replace(" ","-")
    fs.writeFileSync(`${formatAuthor}.json`, JSON.stringify(finalArray,null,4));
    console.log(`${author} is complete!`);
  }

  catch(err){
    console.log(err);
  }

}


//Format the array to the format
// {
//  quote: "This is my quote",
//  author: "endam"
// }
async function processArray(array, author){

  try{
    const formattedAuthor = await formatAuthor(author);

    const flattened = await array.reduce((acc, cur)=>
      acc.concat(cur),[]
    );

    //remove quotes from other authors
    const filtered = await flattened.filter(quote=>{
      return quote.includes("― "+formattedAuthor);
    });

    const formatted = await filtered.map(quote=>{
      return {
        "quote" : getQuoteString(quote),
        "author": formattedAuthor
      }
    });

    const final = await formatted.filter(quote=>{
      return quote.quote !== null;
    })

    return final;
  }
  catch(err){
    console.log(err);
  }

}

//extract the quote string from the html text
function getQuoteString(quote){
  try{
    return quote.match(/“([^"]*)”/)[1];

  }
  catch(err){
    return null;
  }
}

//Reformat Author Name so that first letter(s) are capitalised
function formatAuthor(author){
  const split = author.split(" ")
  const upperCase = split.map(name=>{
    return name.charAt(0).toUpperCase() + name.slice(1);
  })
  return join = upperCase.join(" ");
}
