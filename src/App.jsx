import { useState } from 'react'              // for dynamic components
import './App.css'

import Navbar from './sections/Navbar';
import Sidebar from './sections/Sidebar';
import MainContent from './sections/MainContent';

import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";  

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <>
      <div className="container">
        <Navbar />
        <div className="flex">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
          <MainContent activePage={activePage} />
        </div>
      </div>
    </>
  )
}

export default App
