/* eslint no-unused-vars: 0 */

import DopingScatterPlot from './DopingScatterPlot';
import config from './config';

const svg = new DopingScatterPlot('.plot', config, sc => {
  sc.getData(config.dataUrl, (err, data) => {
    sc.drawGraph();
  });
});
