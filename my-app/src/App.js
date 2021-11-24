import { React, useState, useEffect } from 'react';
import './App.css';
import './components/Filters/Filters.css';

import { RecentTracks } from './components/LastFMData/RecentTracks';
import { TopArtists } from './components/LastFMData/TopArtists';
import { TopSongs } from './components/LastFMData/TopSongs';
import Header from './components/Header/Header';
require('dotenv').config()

function App() {

  //useStates
  const [isLimit, setLimit] = useState(20);
  const [isUserName, setUserName] = useState("ChaibaFM");
  const periods = ["12month", "6month", "3month", "1month", "7day", "overall"];
  const [isPeriod, setPeriod] = useState(periods[0]);
  
  //Event handlers
  const limitHandler = (e) => { setLimit(e.target.value); };
  const userNameHandler = (e) => { setUserName(e.currentTarget.value) };
  const periodHandler = (e) => { setPeriod(e.target.value); };
  





  return (
    <div className="App">
      <Header title="LastFM Data"/>

      <section className="filters">
          <label>The top </label>
          <input type="number" placeholder="20" min="5" max="20" id="filterLimit" onChange={e => limitHandler(e)}/> 
          <label> from </label>
          <input type="text" id="filterUserName" value={isUserName} placeholder="Your Username" onChange={e => userNameHandler(e)}/>
          <label> from the last </label>    
          <select name="filterPeriod" id="filterPeriod" onChange={e => periodHandler(e)}>
              {periods.map((d) => {
                  return (<option value={d}>{d}</option>)
              })}
          </select>
      </section>
      
      <TopSongs apiKey={process.env.REACT_APP_KEY} userName={isUserName} limit={5} period={"12month"} />
      <TopArtists apiKey={process.env.REACT_APP_KEY} userName={isUserName} limit={5} period={"12month"} />

    </div>
  );
}


export default App;
