/* eslint no-unused-vars: 0 */

import DopingScatterPlot from './DopingScatterPlot';
import ScatterPlot from './components/ScatterPlot';
import config from './config';

const svg = new DopingScatterPlot('.plot', config, sc => {
  sc.getData(config.dataUrl, (err, data) => {
    sc.drawGraph();
  });
});
