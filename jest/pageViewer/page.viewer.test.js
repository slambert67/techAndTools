//let pageViewer = require('./page.viewer.js');
/*import {pageNumber} from './page.viewer.js';
import {setPageNumber} from './page.viewer.js';
import {pageDescriptor} from './page.viewer.js';*/

let pageViewer = require('./page.viewer.js');



test("setpage number", () => {
    jest.useFakeTimers();
    console.log('setting page number');
    jest.advanceTimersByTime(1000);
    pageViewer.setPageNumber(257);
    console.log('set page number');



    expect(pageViewer.pageNumber).toBe(257);
    // expect(pageViewer.pageDescriptor).toBe(666);
    jest.useRealTimers();
});
