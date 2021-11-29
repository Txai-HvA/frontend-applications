import { React, useState, useEffect } from 'react';
import './App.css';
import './components/Filters/Filters.css';
import { Routes, Route, Link, Switch } from "react-router-dom";


import { TopArtists } from './components/LastFMData/TopArtists';
import { TopSongs } from './components/LastFMData/TopSongs';

import Header from './components/Header/Header';
require('dotenv').config()

function App() {

  //useStates
  const [isLimit, setLimit] = useState(5);
  const [isUserName, setUserName] = useState("ChaibaFM");
  const periods = [
    {value: "12month", text: "12 months"}, 
    {value: "6month", text: "6 months"}, 
    {value: "3month", text: "3 months"}, 
    {value: "1month", text: "1 month"}, 
    {value: "7day", text: "7 days"}, 
    {value: "overall", text: "overall"}
  ];
  const [isPeriod, setPeriod] = useState(periods[0].value);
  
  //Event handlers
  const limitHandler = (e) => { 
    const limit = e.target.value.replace(/\D/g, "");
    //Source https://stackoverflow.com/questions/43067719/how-to-allow-only-numbers-in-textbox-in-reactjs
    setLimit(limit); 
  };

  const userNameHandler = (e) => { setUserName(e.target.value); };
  const periodHandler = (e) => { setPeriod(e.target.value); };

  return (
    <div className="App">
      <Header title="LastFM Data"/>
     
      <Routes>
        <Route path="/" element={
          <section className="filters">
            <label>Show the top </label>
            <input type="number" placeholder="20" min="5" max="20" id="filterLimit" onChange={e => limitHandler(e)}/> 
            <label> favorite artists and songs from </label>
            <input type="text" id="filterUserName" placeholder="Your LastFM Username" onChange={e => userNameHandler(e)}/>
            <label> in the last </label>    
            <select name="filterPeriod" id="filterPeriod" onChange={e => periodHandler(e)}>
               {periods.map((d) => {
                   return (<option value={d.value}>{d.text}</option>)
               })}
            </select>

            <div>
              <Link to="/userstats">Show user stats</Link>
              <Link to="/genrestats">Show genre stats</Link>
            </div>
        </section>
        } />
        <Route path="/userstats" element={
          <div>
            <TopSongs apiKey={process.env.REACT_APP_KEY} userName={isUserName} limit={isLimit} period={isPeriod}/>
            <TopArtists apiKey={process.env.REACT_APP_KEY} userName={isUserName} limit={isLimit} period={isPeriod}/>
          </div>
          } />
        <Route path="/genrestats" element={
          <div>
          </div>
          } />
      </Routes>
    </div>
  );
}


export default App;
