import SvgCanvas from './SvgCanvas';

export default class ScatterPlot extends SvgCanvas {
  // OVERRIDE FUNCTIONS
  postprocessData(data) {
    // datastructure like point[x,y,radius,color]
    const dataX = data.map(d => d[0]);
    const minX = d3.min(dataX);
    const maxX = d3.max(dataX);

    const dataY = data.map(d => d[1]);
    const minY = d3.min(dataY);
    const maxY = d3.max(dataY);

    this.scaleX = d3.scale.linear()
                    .domain([minX, maxX])
                    .range([0, this.drawingArea.width]);
    this.scaleY = d3.scale.linear()
                    .domain([minY, maxY])
                    .range([0, this.drawingArea.height]);

    console.log(this.scaleX(20));

    return data;
  }

  itemsEnter(items) {
    items.append('circle')
           .attr('class', d => `dataItem ${d[3]}`)
           .attr('cx', d => this.scaleX(d[0]))
           .attr('cy', d => this.scaleY(d[1]))
           .attr('r', d => d[2])
           .on('mouseover', d => this.onMouseOver(d))
           .on('mouseout', () => this.onMouseOut());
  }
}
