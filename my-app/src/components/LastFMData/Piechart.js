import useD3 from "../../hooks/useD3";
import {React, useEffect} from "react";
import * as d3 from "d3";

function PieChart ({ }) {



  const new_data = [{ label: 'Apples', value: 10 }, { label: 'Oranges', value: 20 }, { label: 'Peares', value: 20 }];

  let width = 500;
  let height = 500;
  //The radius of the pieplot is half the width or half the height (smallest one)
  let outerRadius = Math.min(width, height) / 2;

  //ordinalScalePie, where each slice has a different color depending on playCount
  let ordinalScalePie = d3.scaleOrdinal()
  .domain(new_data)
    .range(["#cdf564", "#4100f5", "#cb1582", "#191414", "#ffffff"]);

  //ordinalScaleText, where text has different colors depending on playCount
  let ordinalScaleText = d3.scaleOrdinal()
    .domain(new_data)
      .range(["#4100f5", "#cdf564", "#a5ffef", "#ffffff", "#191414"]);

  useEffect(() => {
    drawChart();
  }, [new_data]);

  function drawChart() {
    //Removes the old svg
    d3.select('#userArtistPieChart')
      .select('svg')
      .remove();

    //Creates new svg
    const svg = d3
      .select('#userArtistPieChart')
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);

    //Creates the circle
    //where .innerRadius() is the hole in the middle
    //and where .outerRadius() is the actual radius of the circle
    const arcGenerator = d3.arc().innerRadius(90).outerRadius(outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);

 
    const userArtistPieChartSVG = svg
      .selectAll()
      .data(pieGenerator(new_data))
      .enter();

    //Append arcs
    userArtistPieChartSVG
      .append('path')
        .style('fill', (_, i) => ordinalScalePie(i))
          .transition()
            .delay((d, i) => i * 500)
          .attr('d', arcGenerator)
          .style("opacity", "1");

    //Append text labels
    userArtistPieChartSVG
      .append('text')
        .transition()
          .delay((d, i) => i * 500)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text((d) => d.data.label)
          .style('fill', (_, i) => ordinalScaleText(new_data.length - i))
          .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`);//used to compute the midpoint of the centerline of the arc
  }    

  return <div id="userArtistPieChart" />;
}

export default PieChart;
