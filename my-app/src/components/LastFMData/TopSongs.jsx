import React, { useState, useEffect } from 'react';

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
  });
  
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

      topSongs.map((d) => {
        topSongsNew.push({
          songName: d.name,
          artistName: d.artist.name,
          playCount: d.playcount,
          url: d.url,
          image: d.image[2]["#text"]
        })
      });

      return (
        <div>
          <h2>Top {limit} Songs of the last {period} from {userName}</h2>
          <ul>
            {topSongsNew.map((d, i) => {
              return (<li>
                        <a href={d.url}>
                          <img src={d.image} alt={d.songName} width="40px"/> #{i+1} <b>{d.artistName} - {d.songName}</b> played {d.playCount} times
                        </a>
                      </li>)
            })}
          </ul>
        </div>
      )
    }
  };

  return buildLastFmData();
};