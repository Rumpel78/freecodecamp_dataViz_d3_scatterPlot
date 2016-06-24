import SvgCanvas from './SvgCanvas';

export default class DrawingArea extends SvgCanvas {
   //OVERRIDE FUNCTIONS
  postprocessData(data) { 
    this.scaleY = d3.scale.linear()
                    .domain(data.map(d => d.Place))
                    .range([this.drawingArea.height,0]);
    return data; 
  }

  itemsEnter(items) {
    items.append('g')
           .attr('class', 'dataItem')
           .attr('r', 5)
           .attr('x', d => { console.log(d); });
  }

  createXaxis(parentElement) { }
  createYaxis(parentElement) { }
}
