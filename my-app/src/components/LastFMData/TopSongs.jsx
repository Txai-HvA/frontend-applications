import React, { useState, useEffect } from 'react';
import useD3 from "../../hooks/useD3";
import * as d3 from "d3";
import './TopSongs.css';
import ColorHash from 'color-hash'

export const TopSongs = ({ apiKey, userName, limit, period }) => {





  const [lastFMData, updatelastFMData] = useState({});
  let colorHash = new ColorHash();
  
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
        return <h2>Loading songs data... ⏳</h2>;
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


      //Creates the bar chart
      const createGraph = (topSongsNew) => {
        //marginLeft, width & height off the svg
        const marginLeft = 500;
        const width = 1000;
        const height = 800;

        //Removes the old svg
        d3.select('#userSongBarChart')
          .select('svg')
          .remove();

        //Creates sources <svg> element
        const userSongBarChartSVG = d3.select("#userSongBarChart").append("svg")
          .attr("width", "100%")
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
        let labelY;
        switch(topSongsNew.length) {
          case 5:  labelY = 62; break;
          case 6:  labelY = 50; break;
          case 7:  labelY = 42; break;
          case 8:  labelY = 37; break;
          case 9:  labelY = 32; break;
          case 10: labelY = 27; break;
          case 11: labelY = 25; break;
          case 12: labelY = 22; break;
          case 13: labelY = 20; break;
          case 14: labelY = 19; break;
          case 15: labelY = 17; break;
          case 16: labelY = 16; break;
          case 17: labelY = 15; break;
          case 18: labelY = 13; break;
          case 19: labelY = 13; break;
          case 20: labelY = 12; break;
        }

      //gets the width of the image, turns into a negative number and changes the x coordinate of the songNames
      userSongBarChartSVG.selectAll("text").attr("x", (Math.abs(yscale.bandwidth()) * -1.) - 20)
      //Source https://stackoverflow.com/questions/5574144/positive-number-to-negative-number-in-javascript









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

      rect
        .attr("class", "bar")
        .attr("rx", 2)//rounded corners
        .attr("height", yscale.bandwidth())//bar thickness
        .transition()
          .ease(d3.easeElastic)//Animation when the amount of shown songs gets changed
            .attr("y", (d, i) => yscale(`${d.artistName} - ${d.songName} - #${i+1}`))
        .style("fill",  (d, i) => colorHash.hex(d.artistName))
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
        .attr("x", Math.abs(yscale.bandwidth()) * -1.)//gets the width of the image, turns into a negative number, so its next to the bar
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

      labels.attr("class","playCountLabel")
        .style('fill', (d, i) => {
          let artistColor = colorHash.hex(d.artistName);
          artistColor = invertColor(artistColor);
          return artistColor;
        })
        .attr("x", (d) => xscale(d.playCount) / 2 + (width / 2.2)) 
        .attr("y", (d, i) => yscale(`${d.artistName} - ${d.songName} - #${i+1}`) + labelY)
        .attr("dy", ".75em")
        .transition().delay((d, i) =>  i * 50)//Animation where the labels fade in one by one
          .style("opacity", 1)
          .text((d) => d.playCount);
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
            


      if(topSongsNew.length > 0) {
        //Wait 1 second till the graph can generate
        setTimeout(function() {
          createGraph(topSongsNew);
        }, 1000);
      }
      
      return (
        <div id="userSongContainer">
         <h3>Top Songs 🎵</h3>
         <div id="userSongBarChart">
         </div>
        </div>
       );
    }
  };

  return buildLastFmData();
};