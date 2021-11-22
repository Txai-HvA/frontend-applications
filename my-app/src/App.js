import { React, useState } from 'react';
import './App.css';
import { RecentTracks } from './components/LastFMData/RecentTracks';
import { TopArtists } from './components/LastFMData/TopArtists';
import { TopSongs } from './components/LastFMData/TopSongs';
import Header from './components/Header/Header';
require('dotenv').config()

function App() {

  const [isHeaderVisible, setHeaderVisible] = useState(false);

  return (
    <div className="App">
      

      { isHeaderVisible ? <Header children="Test"/> : null }

      {/* <RecentTracks userName={'ChaibaFM'} apiKey={'b10dc8ca671bec8f905ba180a76b4706'} /> */}
      <TopArtists  apiKey={process.env.REACT_APP_KEY} userName={'ChaibaFM'} limit={5} period={"12month"} />
      <TopSongs apiKey={'b10dc8ca671bec8f905ba180a76b4706'} userName={'ChaibaFM'} limit={5} period={"12month"} />

      

      <button onClick={() => setHeaderVisible(true)}>
        Show Header
      </button>
    </div>
  );
}

export default App;
