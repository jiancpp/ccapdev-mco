import { Routes, Route } from "react-router-dom";
import { useState } from "react";

/******** Layouts ********/
import MainLayout from './sections/MainLayout'
import SecondLayout from "./sections/SecondLayout.jsx";

/******** Components ********/
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Artists from './pages/Artists.jsx'
import UserProfile from './pages/UserProfile.jsx'
import ArtistProfile from './pages/ArtistProfile.jsx'
import ArtistView from './pages/ArtistView.jsx'
import ScrollToTopWrapper from './components/ScrollToTopWrapper'
import AboutUnsynth from "./pages/AboutUnsynth";

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
          <Route path='/register' element={<Register />} />
          <Route path='/about' element={<AboutUnsynth />} />

          {/* MAIN PAGES (w/ Navbar and Sidebar) */}
          <Route element={<MainLayout activeUserID={activeUser} setActiveUser={setActiveUser}/>}>
            <Route path='/' element={<Home />}></Route>
            <Route path='/artists' element={<Artists />}></Route>
            <Route path='/profile/:user_id' element={<UserProfile />}></Route>
            <Route path='/artists/artist-profile/:artist_id' element={<ArtistProfile />}></Route>
          </Route>

          {/* SECONDARY PAGES (w/ Navbar) */}
          <Route element={<SecondLayout activeUserID={activeUser} setActiveUser={setActiveUser}/>}>
            <Route path='/artist-view/:artist_id' element={<ArtistView />}></Route>
          </Route>

        </Route>
      </Routes>
    </>
  )
}

export default App
