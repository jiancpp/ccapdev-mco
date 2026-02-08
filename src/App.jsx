import { useState } from 'react'              // for dynamic components
import './App.css'

import Navbar from './sections/Navbar';
import Sidebar from './sections/Sidebar';
import MainContent from './sections/MainContent';
import ReviewModal from './pages/ReviewModal';

import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";  

function App() {
  const [activePage, setActivePage] = useState({page: "home", params: {}});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="container">
        <Navbar />
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
