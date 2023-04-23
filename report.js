const fs = require('fs');


// convert pages to new obj with tallies instead of lists
function countNodeLinks(pages) {
  const nodes = Object.keys(pages);
  const links = Object.values(pages).flat();
  const result = {
  	'internal links': 0,
  	'external links': 0
  };

  nodes.forEach(node => result[node] = 0);

  links.forEach(link => {
  	if (nodes.includes(link)) {
  		result[link]++;
  		result['internal links']++;
  	} else {
      result['external links']++;
      if (link in result) {
      	result[link]++;
  	  } else {
  	  	result[link] = 1;
  	  };
  	};
  });

  return result;
};


// obj to psuedo map sorted by descending value then alphabetical keys
function sortPages(pages) {
  const sortedPagesArr = Object.keys(pages)
      .sort()
      .sort((a,b) => pages[b] - pages[a])
      .reduce((arr=[], k) => {
        arr.push([k, pages[k]]);
        return arr;
      }, []);
  return sortedPagesArr;
};


// convert num to formated string
function formatNum(num) {
	let prefixStr = '';
	if (num > 999) {
		return num;
	} else if (num > 99) {
	  prefixStr = ' ';
	} else if (num > 9) {
	  prefixStr = '  ';
	} else {
		prefixStr = '   ';
	};
  return prefixStr + num;
};


// log report to CSV file
function saveReport(reportStr, file_path='./reports.csv') {
	console.log('\nSaving report...');
    fs.appendFile(file_path, reportStr, (err) => {
        if (err) {
            console.error(`Write error: ${err}`);
            return;
        };
        console.log(`Report saved at file path: ${file_path}`);
    });
};


// create report str from pages obj
function reportPages(pages) {
  const countedPages = countNodeLinks(pages);
  const sortedPagesArr = sortPages(countedPages);

  let reportStr = 'Report:\n\n';

  for (const [k, v] of sortedPagesArr) reportStr += `${formatNum(v)} link(s) of URL: ${k}\n`;

  reportStr += 
    `\n${formatNum(Object.keys(pages).length)} unique internal URLs found\n` +
    `${formatNum(countedPages['internal links'])} links to internal URLs found\n` +
    `${formatNum(countedPages['external links'])} links to external URLs found\n` +
    `----------\n\n`

  return reportStr;
};


module.exports = {
  sortPages,
	saveReport,
  reportPages
};