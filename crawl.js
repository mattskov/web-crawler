const { URL }    = require('node:url');
const { JSDOM }  = require('jsdom');
const fetch      = require('node-fetch'); 
//    ^ using my old macbook requires node version 16.17.1
//      which doesn't support fetch out of the box


// return uniform URL str
function normalizeURL(currentURL) {
  // 'x' used to conserve line length
  const x = new URL(currentURL);

  //hostname + pathname + remove one trailing '/' if present
  return `${x.hostname}${x.pathname.slice(-1) === '/' ? x.pathname.slice(0,-1) : x.pathname}`;
};


// for testing URL str: isAbsoluteURL.test('str')
const isAbsoluteURL = new RegExp('^(?:[a-z+]+:)?//', 'i');


// return arr of URLs from html
function getURLsFromHTML(htmlBody, baseURL) {
  // parse html string
  const doc = new JSDOM(htmlBody).window.document;
  const aArr = doc.querySelectorAll('a');
  const result = [];

  for (const a of aArr) {
    if (a.hasAttribute('href')) {
      let strURL = a.getAttribute('href');

      // if relative URL, turn to absolute URL 
      if (!isAbsoluteURL.test(strURL)) strURL = new URL(baseURL).origin + strURL;

      result.push(strURL);
    };
  };
  return result;
};


// compare URL domains
function isNotSameDomain(baseURL, currentURL) {
  const baseDomain = new URL(baseURL);
  const currentDomain = new URL(currentURL);
  
  return baseDomain.hostname !== currentDomain.hostname;
};


// fetch page HTML as str
async function fetchHTML(URL) {
  try {
    const res = await fetch(URL);
    
    if (res.status > 399) throw res.statusText;
    
    if (res.headers.get('content-type').slice(0, 9) !== 'text/html') {
      throw `Error: content not html, URL: ${res.headers.get('content-type')}`
    };
    
    console.log('fetching HTML: ' + URL);
    
    return res.text();
  } catch(err) {
    console.log(`Catch: ${err}`);
  };
};


// aggregate pages obj and arr of pages objs
async function aggregatePages(pages, pagesArr) {
  for (const awaitPages of pagesArr) {
    const returnedPages = await awaitPages;
    
    for (const k of Object.keys(returnedPages)) {
      if (!(k in pages)) pages[k] = returnedPages[k];
    };
  };
  return pages;
};


// crawl URL domain recursively to search its link tree
async function crawlPage(baseURL, currentURL=baseURL, pages={}) {
  // use just URL's origin and pathname without trailing '/'
  let normalizedURL = normalizeURL(currentURL);

  // add URL to pages
  pages[normalizedURL] = [];

  // holds recurrences for aggregation
  const pagesArr = [];

  const htmlBody = await fetchHTML(currentURL);

  if (typeof htmlBody === 'undefined') {
    return pages;
  };

  // fetch list of URL anchor links on page
  let URLsArr = getURLsFromHTML(htmlBody, baseURL);

  // check each URL in list
  for (const URL of URLsArr) {
    // use just URL's origin and pathname without trailing '/'
    let normURL = normalizeURL(URL);

    // if links to different site
    if (isNotSameDomain(baseURL, URL)) {
      pages[normalizedURL].push(normURL);
      continue;
    };

    // add link to node
    pages[normalizedURL].push(normURL);

    // if visited, just tally, else crawl
    if (normURL in pages) continue;

    // recursion
    pagesArr.push(crawlPage(baseURL, URL, pages));
  };

  // add recurrences to result
  pages = aggregatePages(pages, pagesArr);

  return pages;
};


module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
};
