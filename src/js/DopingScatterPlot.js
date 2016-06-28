import ScatterPlot from './components/ScatterPlot';

export default class DopingScatterPlot extends ScatterPlot {
  // Change drawingarea width because of long names
  init() {
    this.drawingArea.width = this.drawingArea.width - 100;
  }

  // Prepare data for ScatterPlot
  postprocessData(data) {
    // datastructure like point[x,y,radius,color]
    const minTime = d3.min(data.map(d => d.Seconds));
    data = data.map((d) => {
      const color = (d.Doping === '') ? 'blue' : 'red';
      return [d.Seconds - minTime, d.Place, 5, color, d];
    });
    data = super.postprocessData(data);

    // Override default scale
    const maxX = d3.max(data.map(d => d[0])) + 10;
    const maxY = d3.max(data.map(d => d[1])) + 1;

    this.scaleX = d3.scale.linear()
                    .domain([maxX, 0])
                    .range([0, this.drawingArea.width]);
    this.scaleY = d3.scale.linear()
                    .domain([1, maxY])
                    .range([0, this.drawingArea.height]);

    return data;
  }

  // Custom X-Axis for Scatterplot
   createXaxis(parentElement) {
    // Create x axis
    // Create x axis
     const minDate = new Date(0, 0, 0, 0, 0, 0, 0);
     const maxX = d3.max(this.data.map(d => d[0])) + 10;
     const maxDate = new Date(0, 0, 0, 0, 0, maxX, 0);
     const format = d3.time.format('%M:%S');

     console.log(format(minDate), format(maxDate));
     const scaleXaxis = d3.time.scale()
                    .domain([maxDate, minDate])
                    .range([0, this.drawingArea.width]);
     this.axisX = d3.svg.axis()
                    .scale(scaleXaxis)
                    .ticks(10)
                    .tickFormat(format)
                    .orient('bottom');
    // Draw x axis
     parentElement.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${this.drawingArea.height})`)
            .call(this.axisX);
   }

   // Set tooltip content
  tooltipSetContent(dataItem) {
    const raw = dataItem[4];
    console.log(raw);
    return `${raw.Name}: ${raw.Nationality}<br>
            Year: ${raw.Year} Time: ${raw.Time}<br>
            <br>
            ${raw.Doping}`;
  }

  // Add names on data enter
  itemsEnter(items) {
    super.itemsEnter(items);
    items.append('text')
           .attr('class', 'name')
           .attr('x', d => this.scaleX(d[0]) + 10)
           .attr('y', d => this.scaleY(d[1]) + 5)
           .text(d => d[4].Name);
  }

 drawGraph() {
   super.drawGraph();
   const legend = this.drawingArea.element
        .append('g')
        .attr('class','legend')
        .attr('transform',`translate(${this.drawingArea.width-50},${this.drawingArea.height / 2})`);
   legend.append('circle')
        .attr('class','dataItem red')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r',5);
   legend.append('text')
        .attr('x',10)
        .attr('y',4)
        .text('Riders with doping allegations');
   legend.append('circle')
        .attr('class','dataItem blue')
        .attr('cx',0)
        .attr('cy',15)
        .attr('r',5);
   legend.append('text')
        .attr('x',10)
        .attr('y',19)
        .text('No doping allegations');
 }
}
