import React, { useState, useEffect } from 'react';
import * as d3 from "d3";
import './TopArtists.css';
import ColorHash from 'color-hash'

export const TopArtists = ({ apiKey, userName, limit, period }) => {
  const [lastFMData, updatelastFMData] = useState({});
  let colorHash = new ColorHash();
  
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

  const createPieChart = () => {
    const { error } = lastFMData;

    if (error) {
      return <p>{error}</p>;
    } else {
      const topArtists = lastFMData?.topartists?.artist;

      if (!topArtists) {
        return <h2>Loading artists data... ⏳</h2>;
      }

      let topArtistsNew = [];

      topArtists.forEach(d => {
        topArtistsNew.push({
          artistName: d.name,
          value: d.playcount,
          url: d.url,
          image: d.image[2]["#text"]
        })
      });

      //Creates the pie chart
      const createGraph = (topArtistsNew) => {
        let width = 500;
        let height = 500;
        //The radius of the pieplot is half the width or half the height (smallest one)
        let outerRadius = Math.min(width, height) / 2;
  
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
            .style('fill', (d, i) => colorHash.hex(d.data.artistName))
              .transition()
                .delay((d, i) => i * 500)
              .attr('d', arcGenerator)
              .style("opacity", "1");

        //Tooltip?
        const path = userArtistPieChartSVG.selectAll('path');
        path.on("mouseover", (i, d) => {
          // console.log(d.data.artistName)

        });
        
        //Append text labels
        userArtistPieChartSVG
          .append('text')
            .transition()
              .delay((d, i) => i * 500)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d) => d.data.value)
              .style('fill', (d, i) => {
                let artistColor = colorHash.hex(d.data.artistName);
                artistColor = invertColor(artistColor);
                return artistColor;
              })
              .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`);//used to compute the midpoint of the centerline of the arc
      }

      //Inverts the color of the given hex
      const invertColor = (hex) => {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        // invert color components
        let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        // pad each with zeros and return
        return '#' + padZero(r) + padZero(g) + padZero(b);
      }
  
      //Adds 0's if needed
      const padZero = (str, len) => {
        len = len || 2;
        let zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
      }
      //Source https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color

      if(topArtistsNew.length > 0) {
        //Wait 1 second till the graph can generate
        setTimeout(function() {
          createGraph(topArtistsNew);
        }, 1000);
      }
            
      return (<div id="userArtistContainer"> 
                <div>
                  <h3>Top Artists 🎙️</h3>
                  <div id="userArtistPieChart" />
                </div>
                <ul id="userArtistLegend">
                  {topArtistsNew.map((d, i) => {
                    return (<li>
                              <a href={d.url}>
                                <span style={{color: "transparent", textShadow: `0 0 0 ${colorHash.hex(d.artistName)}`}}>🎙️</span> #{i+1} {d.artistName} 
                              </a>
                            </li>)
                  })}
                </ul>
              </div>);
    }    
  };

  return createPieChart();
};



