import React, { useState, useEffect } from 'react';

export const RecentTracks = ({ apiKey, userName }) => {
  const [lastFMData, updatelastFMData] = useState({});
  
  useEffect(() => {
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&limit=1&nowplaying=true&format=json`)
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
      const recentTrack = lastFMData?.recenttracks?.track;

      if (!recentTrack) {
        return <p>Loading</p>;
      }
    
      const [
        { name: songName, artist: { '#text': artistName } = {} } = {}
      ] = recentTrack;
    
      return <p>Currently listening to: {songName} by {artistName}</p>;
    }
  };

  return buildLastFmData();
};