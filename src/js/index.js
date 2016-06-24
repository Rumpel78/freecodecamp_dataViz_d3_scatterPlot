/* eslint no-unused-vars: 0 */

import ScatterPlot from './components/ScatterPlot';
import config from './config';

const svg = new ScatterPlot('body', config, sc => {
  sc.getData(config.dataUrl, (err, data) => {
    sc.drawGraph();
  });
});

