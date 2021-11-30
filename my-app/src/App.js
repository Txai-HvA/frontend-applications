import { React, useState, useEffect } from 'react';
import './App.css';
import './components/Filters/Filters.css';
import './components/LastFMData/Stats.css';
import { Routes, Route, Link, Switch } from "react-router-dom";

import { useLocalStorage } from "./components/useLocalStorage";

import { TopArtists } from './components/LastFMData/TopArtists';
import { TopSongs } from './components/LastFMData/TopSongs';

import Header from './components/Header/Header';
require('dotenv').config()

function App() {

  //useStates
  const [isLimit, setLimit] = useLocalStorage("limit", "5");
  const [isUserName, setUserName] = useLocalStorage("username", "ChaibaFM");
  const genres = [
    {value: "k-pop", text: "K-Pop"}, 
    {value: "hip-hop", text: "Hip hop"}, 
    {value: "rnb", text: "R&B"}, 
    {value: "folk", text: "Folk"}, 
    {value: "pop", text: "Pop"}, 
    {value: "rock", text: "Rock"}
  ];
  const [isGenre, setGenre] = useLocalStorage("genre", "K-Pop");
  const periods = [
    {value: "12month", text: "12 months"}, 
    {value: "6month", text: "6 months"}, 
    {value: "3month", text: "3 months"}, 
    {value: "1month", text: "1 month"}, 
    {value: "7day", text: "7 days"}, 
    {value: "overall", text: "overall"}
  ];
  const [isPeriod, setPeriod] = useLocalStorage("periode", "12month");

  //Event handlers
  const limitHandler = (e) => { 
    // const limit = e.target.value.replace(/\D/g, "");
    // //Source https://stackoverflow.com/questions/43067719/how-to-allow-only-numbers-in-textbox-in-reactjs
    setLimit(e.target.value); 
  };
  const userNameHandler = (e) => { setUserName(e.target.value); };
  const genreHandler = (e) => { setGenre(e.target.value); };
  const periodHandler = (e) => { setPeriod(e.target.value); };

  

  return (
    <div className="App">
      <Header title="LastFM Data"/>
     
      <Routes>
        <Route path="/" element={
          <form className="filters">
            <label>Show the top </label>
            <input type="number" pattern="/[0-9]+/" placeholder="20" min="5" max="20" id="filterLimit" onChange={e => limitHandler(e)} value={isLimit}/> 
            <label> favorite artists and songs from user </label>
            <input type="text" id="filterUserName" placeholder="Your LastFM Username" onChange={e => userNameHandler(e)} value={isUserName}/>
            <label> and genre </label>
            <select name="filterGenre" id="filterGenre" onChange={e => genreHandler(e)} value={isGenre}>
               {genres.map((d) => {
                   return (<option value={d.value}>{d.text}</option>)
               })}
            </select>


            <label> in the last </label>    
            <select name="filterPeriod" id="filterPeriod" onChange={e => periodHandler(e)} value={isPeriod}>
               {periods.map((d) => {
                   return (<option value={d.value}>{d.text}</option>)
               })}
            </select>

            <div>
              <Link to="/userstats">Show user stats 📊</Link>
              <Link to="/genrestats">Show genre stats 📊</Link>
            </div>
        </form>
        } />
        <Route path="/userstats" element={
          <div id="stats">
            <h2><a href={`https://www.last.fm/user/${isUserName}`}>{isUserName}'s stats 📊</a></h2>
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
