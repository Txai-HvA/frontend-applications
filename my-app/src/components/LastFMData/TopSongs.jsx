import React, { useState, useEffect } from 'react';
import useD3 from "../../hooks/useD3";
import * as d3 from "d3";
import './TopSongs.css';

export const TopSongs = ({ apiKey, userName, limit, period }) => {
  const [lastFMData, updatelastFMData] = useState({});
  
  useEffect(() => {
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${userName}&api_key=${apiKey}
      &limit=${limit}&period=${period}&nowplaying=true&format=json`)
      .then(response => {

        if (response.status === 404) {
          return null
        } 
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
      const topSongs = lastFMData?.toptracks?.track;

      if (!topSongs) {
        return <p>Loading</p>;
      }

      let topSongsNew = [];
     

      topSongs.forEach(d => {
        topSongsNew.push({
          songName: d.name,
          artistName: d.artist.name,
          playCount: d.playcount,
          url: d.url,
          image: d.image[2]["#text"]
        })
      });













//marginLeft, width & height off the svg
const marginLeft = 320;
const width = 800;
const height = 800;

//Creates sources <svg> element
const userSongBarChartSVG = d3.select("#userSongBarChart").append("svg")
.attr("width", width)
.attr("height", height)

//Group is used to enforce given marginLeft
const g = userSongBarChartSVG.append("g")
  .attr("transform", `translate(${marginLeft},${0})`);

//Scales setup
const xscale = d3.scaleLinear().range([0, width]);//playCount
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.2);//songName

//Axis setup
const yaxis = d3.axisLeft().scale(yscale);
const g_yaxis = g.append("g").attr("class","y axis");


        //update the scales
  xscale.domain([0, d3.max(topSongsNew, (d) => d.playCount)]);
  yscale.domain(topSongsNew.map((d, i) => `${d.artistName} - ${d.songName} - #${i+1}`)); //Mapping on artist and song name
  
  //Render the y axis
  g_yaxis.call(yaxis);

  //Fix for positioning
  let rectX, labelY, labelX;
  switch(topSongsNew.length) {
    case 5:  rectX = 94.5; labelY = 62; labelX = 350; break;
    case 6:  rectX = 72;   labelY = 50; labelX = 330; break;
    case 7:  rectX = 56;   labelY = 42; labelX = 320; break;
    case 8:  rectX = 44;   labelY = 37; labelX = 310; break;
    case 9:  rectX = 33.5; labelY = 32; labelX = 300; break;
    case 10: rectX = 26.5; labelY = 27; labelX = 300; break;
    case 11: rectX = 20.5; labelY = 25; labelX = 290; break;
    case 12: rectX = 16;   labelY = 22; labelX = 290; break;
    case 13: rectX = 12;   labelY = 20; labelX = 290; break;
    case 14: rectX = 8;    labelY = 19; labelX = 290; break;
    case 15: rectX = 4.5;  labelY = 17; labelX = 290; break;
    case 16: rectX = 1.5;  labelY = 16; labelX = 290; break;
    case 17: rectX = 0;    labelY = 15; labelX = 290; break;
    case 18: rectX = -3.5; labelY = 13; labelX = 290; break;
    case 19: rectX = -4;   labelY = 13; labelX = 290; break;
    case 20: rectX = -6.5; labelY = 12; labelX = 290; break;
  }














  //DATA JOIN
  const rect = g.selectAll("rect").data(topSongsNew).join(
    //ENTER 
    //new DOM elements
    (enter) => {
      const rect_enter = enter.append("rect").attr("x", 0);
      return rect_enter;
    },
    //UPDATE
    //update existing DOM elements
    (update) => update,
    //EXIT
    //removes DOM elements that aren't associated with data
    (exit) => exit.remove()
  );

  //quantizeScaleBars. In this case, 20 colors divided by the range of colors(5)
  let quantizeScaleBars = d3.scaleQuantize()
    .domain([0, 20])
      .range(["#a5ffef", "#cdf564", "#cb1582", "#191414", "#ffffff"]);

  rect
    .attr("class", "bar")
    .attr("x", rectX)
    .attr("rx", 2)//rounded corners
    .attr("height", yscale.bandwidth())//bar thickness
    .transition()
      .ease(d3.easeElastic)//Animation when the amount of shown songs gets changed
      .attr("y", (d, i) => yscale(`${d.artistName} - ${d.songName} - #${i+1}`))
    .style("fill", function(d, i) {
      return quantizeScaleBars(i);
    })
    .transition()//Animation when the bars appear
      .ease(d3.easeBack)
      .delay(function(d, i) {
        return i * 40;
      })
      .attr("width", (d) => xscale(d.playCount) / 2);//width of the bars

  //Links to the LastFM page of the song
  rect.on("click", (i, d) => window.open(d.url));
  //Source https://stackoverflow.com/questions/32305898/link-in-d3-bar-chart
  //https://stackoverflow.com/questions/7077770/window-location-href-and-window-open-methods-in-javascript










  //DATA JOIN
  const images = g.selectAll("image").data(topSongsNew).join(
    //ENTER 
    //new DOM elements
    (enter) => {
      const image_enter = enter.append("svg:image").attr("x", 0);
      return image_enter;
    },
    //UPDATE
    //update existing DOM elements
    (update) => update,
    //EXIT
    //removes DOM elements that aren't associated with data
    (exit) => exit.remove()
  );

  //Ads images in front of the bars
  images.attr("xlink:href", (d) => d.image)//gets image url
      .attr("x", -38)
      .attr("y", (d, i) => yscale(`${d.artistName} - ${d.songName} - #${i+1}`))
      .attr("width", yscale.bandwidth())
      .attr("height", yscale.bandwidth());
  //Source http://bl.ocks.org/hwangmoretime/c2c7128c5226f9199f87

  //Links to the LastFM page of the song
  images.on("click", (i, d) => window.open(d.url));










  //DATA JOIN
  const labels = userSongBarChartSVG.selectAll(".playCountLabel").data(topSongsNew).join(
    //ENTER 
    //new DOM elements
    (enter) => {
      const label_enter = enter.append("svg:text").attr("x", 0);
      return label_enter;
    },
    //UPDATE
    //update existing DOM elements
    (update) => update,
    //EXIT
    //removes DOM elements that aren't associated with data
    (exit) => exit.remove()
  );

//quantizeScaleText, where text has different colors depending on playCount
let quantizeScaleText = d3.scaleQuantize()
.domain([0, 20])
  .range(["#cb1582", "#4100f5", "#a5ffef", "#ffffff", "#191414"]);

labels.attr("class","playCountLabel")
        .style("fill", function(d, i) {
          return quantizeScaleText(i);
        })
        .attr("x", (d) => xscale(d.playCount) / 2 + labelX)
        .attr("y", (d, i) => yscale(`${d.artistName} - ${d.songName} - #${i+1}`)  + labelY)
        .attr("dy", ".75em")
        .transition().delay((d, i) =>  i * 50)//Animation where the labels fade in one by one
          .style("opacity", 1)
          .text((d) => d.playCount);














       
      
       return (
         <div id="userSongContainer">
          <label>Top Songs</label>
          <div id="userSongBarChart">
          </div>
         </div>
        );
    }
  };

  return buildLastFmData();
};