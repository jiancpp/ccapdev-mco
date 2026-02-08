import { useState } from 'react'              // for dynamic components
import './App.css'

import Navbar from './sections/Navbar';
import Sidebar from './sections/Sidebar';
import MainContent from './sections/MainContent';
import ReviewModal from './pages/ReviewModal';
import Login from './pages/Login'

import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";  

function App() {
  const [activePage, setActivePage] = useState({page: "home", params: {}});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // TODO: Change Later
  const showLogin = () => setIsLoginOpen(true);

  return (
    <>
      <div className={`container ${!isLoginOpen ? "hidden" : ""}`}>
        <Login />
      </div>
      <div className={`container ${isLoginOpen ? "hidden" : ""}`}>
        <Navbar showLogin={showLogin} />
        <div className="flex">
          <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            openModal={openModal} 
          />
          <MainContent 
            activePage={activePage} 
            setActivePage={setActivePage}
            openModal={openModal} 
          />
        </div>
      </div>
      <ReviewModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

export default App
