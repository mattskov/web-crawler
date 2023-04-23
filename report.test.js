const { test, expect }  = require('@jest/globals');
const { sortPages }     = require('./report.js');


describe('report.js: sortPages(pages)', () => {
  const receivedObj = {
    a: 2,
    b: 1,
    c: 3,
    d: 2
  };
  const expectedArr = [
    [ 'c', 3 ],
    [ 'a', 2 ],
    [ 'd', 2 ],
    [ 'b', 1 ]
  ];

  test('tests receivedObj', () => {
    expect(sortPages(receivedObj)).toStrictEqual(expectedArr);
  });
  test('tests empty', () => {
    expect(sortPages({})).toStrictEqual([]);
  });
});