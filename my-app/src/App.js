import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';

function App() {

  const [isHeaderVisible, setHeaderVisible] = useState(false);


  return (
    <div className="App">
      

      { isHeaderVisible ? <Header children="Test"/> : null }

      <button onClick={() => setHeaderVisible(true)}>
        Show Header
      </button>
    </div>
  );
}

export default App;
