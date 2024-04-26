// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import GameArea from './components/GameArea';
import { API } from './core/coreApi';
import { useEffect } from 'react';

// const api = new API();

function App() {
  // const [count, setCount] = useState(0)
  useEffect(() => {
    console.log("HERE")
    const fetchData = async () => {
        await API.getInstance().getQuestion();
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="bg-base-100">
        <GameArea />
      </div>
    </>
  )
}

export default App
