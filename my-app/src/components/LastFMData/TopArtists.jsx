import React, { useState, useEffect } from 'react';
import useD3 from "../../hooks/useD3";
import * as d3 from "d3";
import './TopArtists.css';

export const TopArtists = ({ apiKey, userName, limit, period }) => {
  const [lastFMData, updatelastFMData] = useState({});
  
  useEffect(() => {
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=${userName}&api_key=${apiKey}
      &limit=${limit}&period=${period}&nowplaying=true&format=json`)
      .then(response => {
        if (response.ok) {//Checks whether the HTTP response is okay
          return response.json();//Extract the JSON from the response
        }
        throw new Error('error');
      })
      .then(data => updatelastFMData(data))
      .catch(() =>
        updatelastFMData({ error: 'Whoops! Something went wrong with Last.fm' })
      );
  }, []);
  
  const buildLastFmData = () => {
    const { error } = lastFMData;

    if (error) {
      return <p>{error}</p>;
    } else {
      const topArtists = lastFMData?.topartists?.artist;

      if (!topArtists) {
        return <p>Loading</p>;
      }

      let topArtistsNew = [];

      topArtists.map((d) => {
        topArtistsNew.push({
          artistName: d.name,
          value: d.playcount,
          url: d.url,
          image: d.image[2]["#text"]
        })
      });

      let width = 500;
      let height = 500;
      //The radius of the pieplot is half the width or half the height (smallest one)
      let outerRadius = Math.min(width, height) / 2;

      //ordinalScalePie, where each slice has a different color depending on playCount
      let ordinalScalePie = d3.scaleOrdinal()
        .domain(topArtistsNew)
          .range(["#cdf564", "#4100f5", "#cb1582", "#191414", "#ffffff"]);

      //ordinalScaleText, where text has different colors depending on playCount
      let ordinalScaleText = d3.scaleOrdinal()
        .domain(topArtistsNew)
          .range(["#4100f5", "#cdf564", "#a5ffef", "#ffffff", "#191414"]);


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
        .data(pieGenerator(topArtistsNew))
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
          .text((d) => d.data.value)
            .style('fill', (_, i) => ordinalScaleText(i))
            .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`);//used to compute the midpoint of the centerline of the arc


      return (<div id="userArtistContainer"> 
                <label>Top Artists</label>
                <div id="userArtistPieChart" />
                <ul>
                  {topArtistsNew.map((d, i) => {
                    return (<li>
                              <a href={d.url}>
                              <img src={d.image} alt={d.songName} width="40px"/> #{i+1} {d.artistName} 
                              </a>
                            </li>)
                  })}
                </ul>
              </div>);
    }    
  };

  return buildLastFmData();
};



