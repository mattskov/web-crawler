const { crawlPage }                = require('./crawl.js');
const { saveReport, reportPages }  = require('./report.js');


async function main() {
  // check if one CLI arg input, first two args are env vars
  if (process.argv.length !== 3) throw new Error('include just one CLI arg for base URL');

  console.log(`Starting web crawl at URL: '${process.argv[2]}'\n`);
  
  const crawledPage = await crawlPage(process.argv[2])

  saveReport(reportPages(crawledPage));
};


main();