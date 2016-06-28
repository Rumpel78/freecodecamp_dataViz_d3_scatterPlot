(function () {
    'use strict';

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var get = function get(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };

    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };

    var DrawingArea = function DrawingArea(parentSvg, config, cb) {
        classCallCheck(this, DrawingArea);


        this.width = config.canvasWidth - config.padding[0] - config.padding[2];
        this.height = config.canvasHeight - config.padding[1] - config.padding[3];
        this.translateX = config.padding[0];
        this.translateY = config.padding[1];

        this.element = parentSvg.append('g').attr('class', 'drawingArea').attr('transform', 'translate(' + this.translateX + ', ' + this.translateY + ')').attr('width', this.width).attr('height', this.height);

        if (cb) cb(this);
    };

    var SvgCanvas = function () {
      function SvgCanvas(parentElement, config, cb) {
        classCallCheck(this, SvgCanvas);

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
        this.init();
        // Callback onLoaded
        if (cb) cb(this);
      }

      createClass(SvgCanvas, [{
        key: 'getData',
        value: function getData(url, cb) {
          var _this = this;

          d3.json(url, function (err, data) {
            _this.data = _this.postprocessData(data);
            if (cb) cb(err, _this.data);
          });
        }
      }, {
        key: 'drawGraph',
        value: function drawGraph() {
          this.createGraph(this.dataGroup);
          this.createXaxis(this.drawingArea.element);
          this.createXaxisLabel(this.drawingArea.element);
          this.createYaxis(this.drawingArea.element);
          this.createYaxisLabel(this.drawingArea.element);
        }
      }, {
        key: 'createGraph',
        value: function createGraph(parentElement) {
          var items = parentElement.selectAll('.dataItem').data(this.data);
          this.itemsExit(items.exit());
          this.itemsEnter(items.enter());
          this.itemsUpdate(items);
        }

        // OVERRIDE FUNCTIONS

      }, {
        key: 'init',
        value: function init() {}
      }, {
        key: 'postprocessData',
        value: function postprocessData(data) {
          // Expecting data in form of array [x,y]

          var dataX = data.map(function (d) {
            return d[0];
          });
          var minX = d3.min(dataX);
          var maxX = d3.max(dataX);

          var dataY = data.map(function (d) {
            return d[1];
          });
          var minY = d3.min(dataY);
          var maxY = d3.max(dataY);

          this.scaleX = d3.scale.linear().domain([minX, maxX]).range([0, this.drawingArea.width]);
          this.scaleY = d3.scale.linear().domain([minY, maxY]).range([0, this.drawingArea.height]);
          return data;
        }
      }, {
        key: 'itemsExit',
        value: function itemsExit(items) {
          items.remove();
        }
      }, {
        key: 'itemsEnter',
        value: function itemsEnter(items) {
          var _this2 = this;

          items.append('g').attr('class', 'dataItem').on('mouseover', function (d) {
            return _this2.onMouseOver(d);
          }).on('mouseout', function () {
            return _this2.onMouseOut();
          });
        }
      }, {
        key: 'itemsUpdate',
        value: function itemsUpdate(items) {}
      }, {
        key: 'createXaxis',
        value: function createXaxis(parentElement) {
          // Create x axis
          this.axisX = d3.svg.axis().scale(this.scaleX).ticks(20).orient('bottom');
          // Draw x axis
          parentElement.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + this.drawingArea.height + ')').call(this.axisX);
        }
      }, {
        key: 'createYaxis',
        value: function createYaxis(parentElement) {
          // Create y axis
          this.axisY = d3.svg.axis().scale(this.scaleY).ticks(20).orient('left');
          // Draw y axis
          parentElement.append('g').attr('class', 'y axis').call(this.axisY);
        }
      }, {
        key: 'createYaxisLabel',
        value: function createYaxisLabel(parentElement) {
          parentElement.append('text').attr('class', 'y axis label').text(this.config.labelY).attr('text-anchor', 'end').attr('transform', 'rotate(-90) translate(-5,15)');
        }
      }, {
        key: 'createXaxisLabel',
        value: function createXaxisLabel(parentElement) {
          parentElement.append('text').attr('class', 'x axis label').text(this.config.labelX).attr('text-anchor', 'middle').attr('x', this.drawingArea.width / 2).attr('y', this.drawingArea.height - 5);
        }
      }, {
        key: 'onMouseOver',
        value: function onMouseOver(dataItem) {
          var content = this.tooltipSetContent(dataItem);
          if (content !== '') {
            this.tooltip.transition().duration(200).style('opacity', 0.9);
            this.tooltip.style('left', d3.event.pageX + 10 + 'px').style('top', d3.event.pageY - 30 + 'px');
            this.tooltip.html(this.tooltipSetContent(dataItem));
          }
        }
      }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
          this.tooltip.transition().duration(500).style('opacity', 0);
        }
      }, {
        key: 'tooltipSetContent',
        value: function tooltipSetContent(dataItem) {
          return dataItem[0] + ' - ' + dataItem[1];
        }

        // INTERNAL FUNCTIONS

      }, {
        key: 'createSvgCanvas',
        value: function createSvgCanvas(parentElement) {
          // Creates basic svg canvas
          return d3.select(parentElement).append('svg').attr('class', 'svgCanvas').attr('width', this.config.canvasWidth).attr('height', this.config.canvasHeight);
        }
      }, {
        key: 'createDataGroup',
        value: function createDataGroup(parentElement) {
          return parentElement.append('g').attr('class', 'dataGroup');
        }
      }, {
        key: 'createToolTip',
        value: function createToolTip() {
          return d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
        }
      }]);
      return SvgCanvas;
    }();

    var ScatterPlot = function (_SvgCanvas) {
      inherits(ScatterPlot, _SvgCanvas);

      function ScatterPlot() {
        classCallCheck(this, ScatterPlot);
        return possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlot).apply(this, arguments));
      }

      createClass(ScatterPlot, [{
        key: 'itemsEnter',

        // OVERRIDE FUNCTIONS

        value: function itemsEnter(items) {
          var _this2 = this;

          // datastructure like point[x,y,radius,class]

          items.append('circle').attr('class', function (d) {
            return 'dataItem ' + d[3];
          }).attr('cx', function (d) {
            return _this2.scaleX(d[0]);
          }).attr('cy', function (d) {
            return _this2.scaleY(d[1]);
          }).attr('r', function (d) {
            return d[2];
          }).on('mouseover', function (d) {
            return _this2.onMouseOver(d);
          }).on('mouseout', function () {
            return _this2.onMouseOut();
          });
        }
      }]);
      return ScatterPlot;
    }(SvgCanvas);

    var DopingScatterPlot = function (_ScatterPlot) {
      inherits(DopingScatterPlot, _ScatterPlot);

      function DopingScatterPlot() {
        classCallCheck(this, DopingScatterPlot);
        return possibleConstructorReturn(this, Object.getPrototypeOf(DopingScatterPlot).apply(this, arguments));
      }

      createClass(DopingScatterPlot, [{
        key: 'init',

        // Change drawingarea width because of long names
        value: function init() {
          this.drawingArea.width = this.drawingArea.width - 100;
        }

        // Prepare data for ScatterPlot

      }, {
        key: 'postprocessData',
        value: function postprocessData(data) {
          // datastructure like point[x,y,radius,color]
          var minTime = d3.min(data.map(function (d) {
            return d.Seconds;
          }));
          data = data.map(function (d) {
            var color = d.Doping === '' ? 'blue' : 'red';
            return [d.Seconds - minTime, d.Place, 5, color, d];
          });
          data = get(Object.getPrototypeOf(DopingScatterPlot.prototype), 'postprocessData', this).call(this, data);

          // Override default scale
          var maxX = d3.max(data.map(function (d) {
            return d[0];
          })) + 10;
          var maxY = d3.max(data.map(function (d) {
            return d[1];
          })) + 1;

          this.scaleX = d3.scale.linear().domain([maxX, 0]).range([0, this.drawingArea.width]);
          this.scaleY = d3.scale.linear().domain([1, maxY]).range([0, this.drawingArea.height]);

          return data;
        }

        // Custom X-Axis for Scatterplot

      }, {
        key: 'createXaxis',
        value: function createXaxis(parentElement) {
          // Create x axis
          // Create x axis
          var minDate = new Date(0, 0, 0, 0, 0, 0, 0);
          var maxX = d3.max(this.data.map(function (d) {
            return d[0];
          })) + 10;
          var maxDate = new Date(0, 0, 0, 0, 0, maxX, 0);
          var format = d3.time.format('%M:%S');

          console.log(format(minDate), format(maxDate));
          var scaleXaxis = d3.time.scale().domain([maxDate, minDate]).range([0, this.drawingArea.width]);
          this.axisX = d3.svg.axis().scale(scaleXaxis).ticks(10).tickFormat(format).orient('bottom');
          // Draw x axis
          parentElement.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + this.drawingArea.height + ')').call(this.axisX);
        }

        // Set tooltip content

      }, {
        key: 'tooltipSetContent',
        value: function tooltipSetContent(dataItem) {
          var raw = dataItem[4];
          console.log(raw);
          return raw.Name + ': ' + raw.Nationality + '<br>\n            Year: ' + raw.Year + ' Time: ' + raw.Time + '<br>\n            <br>\n            ' + raw.Doping;
        }

        // Add names on data enter

      }, {
        key: 'itemsEnter',
        value: function itemsEnter(items) {
          var _this2 = this;

          get(Object.getPrototypeOf(DopingScatterPlot.prototype), 'itemsEnter', this).call(this, items);
          items.append('text').attr('class', 'name').attr('x', function (d) {
            return _this2.scaleX(d[0]) + 10;
          }).attr('y', function (d) {
            return _this2.scaleY(d[1]) + 5;
          }).text(function (d) {
            return d[4].Name;
          });
        }
      }, {
        key: 'drawGraph',
        value: function drawGraph() {
          get(Object.getPrototypeOf(DopingScatterPlot.prototype), 'drawGraph', this).call(this);
          var legend = this.drawingArea.element.append('g').attr('class', 'legend').attr('transform', 'translate(' + (this.drawingArea.width - 50) + ',' + this.drawingArea.height / 2 + ')');
          legend.append('circle').attr('class', 'dataItem red').attr('cx', 0).attr('cy', 0).attr('r', 5);
          legend.append('text').attr('x', 10).attr('y', 4).text('Riders with doping allegations');
          legend.append('circle').attr('class', 'dataItem blue').attr('cx', 0).attr('cy', 15).attr('r', 5);
          legend.append('text').attr('x', 10).attr('y', 19).text('No doping allegations');
        }
      }]);
      return DopingScatterPlot;
    }(ScatterPlot);

    var config = {
      canvasWidth: 800,
      canvasHeight: 550,
      padding: [80, 40, 40, 40],
      dataUrl: 'datasets/cyclist-data.json',
      labelY: 'Ranking',
      labelX: 'Minutes Behind Fastest Time'
    };

    var svg = new DopingScatterPlot('.plot', config, function (sc) {
      sc.getData(config.dataUrl, function (err, data) {
        sc.drawGraph();
      });
    });

}());
//# sourceMappingURL=main.js.map