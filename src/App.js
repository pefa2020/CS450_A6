/*
Name: Percy Flores
Assignment: Assignment 6
Course CS450
Date: 04/18/2025

*/
import React, { Component } from 'react';
import FileUpload from './FileUpload.js';
import * as d3 from 'd3';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }


  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate() {
    this.renderChart()
  }

  set_data = (csv_data) => {
    this.setState({ data: csv_data })
  }

  handleTooltip = (event, d, color, max, isVisible) => {
    const tooltip = d3.select('#tooltip');
    if (isVisible) {
      tooltip.style('visibility', 'visible')
        .text(d.key) // Assuming d.key is the name you want to show
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
      console.log("This is d: ", d)


      // Will procede to add barchart according to key
      // will add an svg to the tooltip

      var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

      var svg = d3.select('#tooltip').append('svg')
        .attr('width', 500)
        .attr('height', 200)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

      // X axis
      var x = d3.scaleBand()
        .domain(d.map(item => item.month)) // Assuming month is a string or categorical
        .range([0, width])
        .padding(0.1); // Add some padding between bars

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b')))
        .selectAll('text')
        .attr('transform', 'translate(-10, 0)rotate(-45)')
        .style('text-anchor', 'end')

      // Y axis
      var y = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0])
      svg.append('g')
        .call(d3.axisLeft(y))

      // Bars
      svg.selectAll('mybar')
        .data(d)
        .enter()
        .append('rect')
        .attr('x', function (d) { return x(d.month) })
        .attr('y', function (d) { return y(d.hashtag_usage) })
        .attr('width', x.bandwidth())
        .attr('height', function (d) { return height - y(d.hashtag_usage) })
        .attr('fill', color)

    } else {
      tooltip.style('visibility', 'hidden');
    }
  }

  renderChart = () => {
    // Render your chart here using the data in this.state.data
    var data = this.state.data
    console.log("This is data: ", data)

    if (data.length === 0) return

    // for GPT4 data separate into a variable. [ {date: new Date(), hashtag_usage: ___}, {}, ... ]
    const gpt4_data = data.map(d => {
      return {
        month: d.month,
        hashtag_usage: d.gpt4
      }
    })

    const gemini_data = data.map(d => {
      return {
        // month: new Date(d.month),
        month: d.month,
        hashtag_usage: d.gemini
      }
    })

    const palm2_data = data.map(d => {
      return {
        // month: new Date(d.month),
        month: d.month,
        hashtag_usage: d.palm2
      }
    })
    const claude_data = data.map(d => {
      return {
        // month: new Date(d.month),
        month: d.month,
        hashtag_usage: d.claude
      }
    })
    const llama31_data = data.map(d => {
      return {
        // month: new Date(d.month),
        month: d.month,
        hashtag_usage: d.llama31
      }
    })

    const myDict = {
      "gpt4": { data: gpt4_data, color: "#e41a1c", max: d3.max(data, d => d.gpt4) },
      "gemini": { data: gemini_data, color: "#377eb8", max: d3.max(data, d => d.gemini) },
      "palm2": { data: palm2_data, color: "#4daf4a", max: d3.max(data, d => d.palm2) },
      "claude": { data: claude_data, color: "#984ea3", max: d3.max(data, d => d.claude) },
      "llama31": { data: llama31_data, color: "#ff7f00", max: d3.max(data, d => d.llama31) }
    }

    console.log("this is gpt4 data: ", gpt4_data)
    /*
      data = [
        {date: new Date(____), gpt4: 120, gemini: 20, palm2: 90, claude: 50, llama31: 90},
        {___},
        {___},
        {___},
      ];
    */

    const margin = { top: 20, right: 20, bottom: 50, left: 50 },
      width = 600 - margin.left - margin.right - 250,
      height = 400 - margin.top - margin.bottom;



    const maxSum = d3.sum([
      d3.max(data, d => d.gpt4),
      d3.max(data, d => d.gemini),
      d3.max(data, d => d.palm2),
      d3.max(data, d => d.claude),
      d3.max(data, d => d.llama31)
    ])

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.month))
      // .range([0, 300]);
      .range([0, width])

    const yScale = d3.scaleLinear()
      .domain([0, maxSum])
      // .range([400, 0])
      .range([height, 0])

    var colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00']

    var stack = d3.stack()
      .keys(['gpt4', 'gemini', 'palm2', 'claude', 'llama31'])
      .offset(d3.stackOffsetWiggle);

    var stackedSeries = stack(data);

    var areaGenerator = d3.area()
      .x(d => xScale(d.data.month))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveCardinal)


    const svg = d3.select('.container')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 50)


    const chartGroup = svg.selectAll('.chart-group')
      .data([null])
      .join('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)



    // In your renderChart method, replace the tooltip logic with calls to handleTooltip
    chartGroup.selectAll('.areas')
      .data(stackedSeries)
      .join('path')
      .attr('class', 'areas')
      .style('fill', (d, i) => colors[i])
      .attr('d', d => areaGenerator(d))
      .on('mouseover', (event) =>
        this.handleTooltip(
          event,
          // { key: event.target.__data__.key },
          myDict[event.target.__data__.key].data,
          myDict[event.target.__data__.key].color,
          myDict[event.target.__data__.key].max,
          true
        ))
      .on('mousemove',
        (event) =>
          this.handleTooltip(
            event,
            // { key: event.target.__data__.key },
            myDict[event.target.__data__.key].data,
            myDict[event.target.__data__.key].color,
            myDict[event.target.__data__.key].max,
            true
          )
      )
      .on('mouseout', () => this.handleTooltip(null, null, null, null, false));

    // Add x-axis
    svg.selectAll('.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${margin.left}, ${height + margin.top + 55})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b')))

    // Add y-axis legend to the right of svg
    const svg_legend = d3.select('.legend')

    // Handmade legend
    svg_legend.append("rect").attr("x", 20).attr("y", 185 - 30 - 30).attr("width", 20).attr("height", 20).style("fill", "#ff7f00")
    svg_legend.append("rect").attr("x", 20).attr("y", 185 - 30).attr("width", 20).attr("height", 20).style("fill", "#984ea3")
    svg_legend.append("rect").attr("x", 20).attr("y", 185).attr("width", 20).attr("height", 20).style("fill", "#4daf4a")
    svg_legend.append("rect").attr("x", 20).attr("y", 185 + 30).attr("width", 20).attr("height", 20).style("fill", "#377eb8")
    svg_legend.append("rect").attr("x", 20).attr("y", 185 + 30 + 30).attr("width", 20).attr("height", 20).style("fill", "#e41a1c")

    svg_legend.append("text").attr("x", 45).attr("y", 135).text("LLaMA-3.1").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg_legend.append("text").attr("x", 45).attr("y", 165).text("Claude").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg_legend.append("text").attr("x", 45).attr("y", 195).text("PaLM-2").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg_legend.append("text").attr("x", 45).attr("y", 225).text("Gemini").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg_legend.append("text").attr("x", 45).attr("y", 255).text("GPT-4").style("font-size", "15px").attr("alignment-baseline", "middle")

  }




  render() {
    return (
      <div className="App">
        <FileUpload set_data={this.set_data} />

        <div style={{ display: "flex", flexDirection: "row" }}>

          <div>
            <svg className="container"></svg>
            <div
              id="tooltip"
              style={{ position: 'absolute', visibility: 'hidden', background: 'lightgrey', padding: '5px', borderRadius: '5px' }}
            ></div>
          </div>

          {/* Create Legend */}
          <div>
            <svg className="legend" style={{ width: "300px", height: "300px", marginTop: "+100px" }}></svg>
          </div>

        </div>
      </div>
    )
  }
}

export default App;