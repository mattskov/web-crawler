const { test, expect }                   = require('@jest/globals');
const { normalizeURL, getURLsFromHTML }  = require('./crawl.js');

describe('crawl.js: normalizeURL(baseURL, currentURL)', () => {
  const expectedURL = 'www.google.com/imghp';

  test('https://www.google.com/imghp?hl=en&ogbl', () => {
    expect(normalizeURL('https://www.Google.Com/imghp?hl=en&ogbl')).toBe(expectedURL);
  });
  test('https://www.Google.com/imghp', () => {
    expect(normalizeURL('https://www.Google.com/imghp')).toBe(expectedURL);
  });
  test('https://www.google.com/imghp/', () => {
    expect(normalizeURL('https://www.google.com/imghp/')).toBe(expectedURL);
  });
  test('http://www.google.com/imghp?hl=en&ogbl', () => {
    expect(normalizeURL('http://www.google.com/imghp?hl=en&ogbl')).toBe(expectedURL);
  });
});

describe('crawl.js: getURLsFromHTML(htmlBody, baseURL)', () => {
  const receivedHTML = '<!DOCTYPE html><html><body><h1>loren ipsum</h1>loren ipsum <a href=""></a> <a href="https://www.google.com"></a> <a href="https://www.google.com/">lorem ipsum</a><a href="/imghp?hl=en&ogbl">lorem ipsum</a>.<p>dsgadsfa</p></body></html>';
  const receivedURL = 'https://www.google.com';
  const expectedURLArr = ['https://www.google.com', 'https://www.google.com', 'https://www.google.com/', 'https://www.google.com/imghp?hl=en&ogbl'];

  test('tests receivedHTML', () => {
    expect(getURLsFromHTML(receivedHTML, receivedURL)).toStrictEqual(expectedURLArr);
  });
});
