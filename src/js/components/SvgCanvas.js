import DrawingArea from './DrawingArea';

export default class SvgCanvas {
  constructor(parentElement, config, cb) {
    // Save config

    this.width = config.canvasWidth;
    this.canvasHeight = config.canvasHeight;
    this.config = config;

    // Store refs to elements
    this.svg = this.createSvgCanvas(parentElement);
    this.drawingArea = new DrawingArea(this.svg, config);
    this.dataGroup = this.createDataGroup(this.drawingArea.element);
    this.tooltip = this.createToolTip();

    this.data = {};

    // Callback onLoaded
    if (cb) cb(this);
  }

  getData(url, cb) {
    d3.json(url, (err, data) => {      
      this.data = this.postprocessData(data);
      if (cb) cb(err, this.data);
    });
  }
  drawGraph() {
    const graph = this.createGraph(this.dataGroup);
    const xAxis = this.createXaxis(this.drawingArea);
    const yAxis = this.createYaxis(this.drawingArea);
    this.createXaxis(this.drawingArea.element);
    this.createYaxis(this.drawingArea.element);
    this.createGraph(this.dataGroup);
  }
  createGraph(parentElement) {
    const items = parentElement.selectAll('.dataItem').data(this.data);
    this.itemsExit(items.exit());
    this.itemsEnter(items.enter());
    this.itemsUpdate(items);
  }

  //OVERRIDE FUNCTIONS
  postprocessData(data) { return data; }
  itemsExit(items) {
    items.remove();
  }
  itemsEnter(items) {
    items.append('g')
           .attr('class', 'dataItem');
  }
  itemsUpdate(items) { }
  createXaxis(parentElement) { }
  createYaxis(parentElement) { }

  //INTERNAL FUNCTIONS
  createSvgCanvas(parentElement) {
    // Creates basic svg canvas
    return d3.select(parentElement)
      .append('svg')
      .attr('class', 'svgCanvas')
      .attr('width', this.config.canvasWidth)
      .attr('height', this.config.canvasHeight);
  }
  createDataGroup(parentElement) {
    return parentElement
      .append('g')
      .attr('class', 'dataGroup');
  }
  createToolTip() {
    return d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  }

}
