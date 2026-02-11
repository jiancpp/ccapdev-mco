import { Routes, Route } from "react-router-dom";
import { useState } from "react";

/******** Layouts ********/
import MainLayout from './sections/MainLayout'

/******** Components ********/
import Login from './pages/Login'
import Home from './pages/Home.jsx'
import Artists from './pages/Artists.jsx'
import UserProfile from './pages/UserProfile.jsx'
import UserProfileEdit from './pages/UserProfileEdit.jsx'
import ArtistProfile from './pages/ArtistProfile.jsx'
import ScrollToTopWrapper from './components/ScrollToTopWrapper'

import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";  

function App() {
  // TODO: Remove later
  const [activeUser, setActiveUser] = useState("u1");

  return (
    <>
      <Routes>
        <Route element={<ScrollToTopWrapper />}>
          {/* AUTH PAGES */}
          <Route path='/login' element={<Login />} />
          {/* <Route path='/register' element={<Register />} /> */}

          {/* MAIN PAGES (w/ Navbar and Sidebar) */}
          <Route element={<MainLayout activeUserID={activeUser} setActiveUser={setActiveUser}/>}>
            <Route path='/' element={<Home />}></Route>
            <Route path='/artists' element={<Artists />}></Route>
            <Route path='/profile/:user_id' element={<UserProfile />}></Route>
            <Route path='/profile/:user_id/edit-profile' element={<UserProfileEdit />}></Route>
            <Route path='/artists/artist-profile/:artist_id' element={<ArtistProfile />}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
