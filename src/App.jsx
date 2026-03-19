/**
 * Main Routing for Front-end
 */
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

/******** Layouts ********/
import MainLayout from './layouts/MainLayout'
import SecondLayout from "./layouts/SecondLayout.jsx";

/******** Components ********/
import AboutUnsynth from "./pages/about/AboutUnsynth";
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import Home from './pages/home/Home.jsx'
import Artists from './pages/artist-pages/Artists.jsx'
import UserProfile from './pages/user-profile/UserProfile.jsx'
import ArtistProfile from './pages/artist-pages/ArtistProfile.jsx'
import SongProfile from './pages/artist-pages/SongProfile.jsx'
import AlbumProfile from "./pages/artist-pages/AlbumProfile.jsx";
import ArtistView from './pages/artist-view/ArtistView.jsx'
import ScrollToTopWrapper from './components/ScrollToTopWrapper'

// TODO: Remove later
import { getUser } from "./api/api";

import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";  

const MOCK_USER = {
  _id: '69b9202a78b9e30e03f59186',
  username: "Torotottie",
  password: "password-Torotottie",
  email: "Torotottie@gmail.com",
  bio: "ꉂ(˵˃ ᗜ ˂˵)",
  avatar: "/assets/torotottie.jpg",
  role: "user",    
}

function App() {
const [activeUser, setActiveUser] = useState(null); // Start with null
  const [isLoading, setIsLoading] = useState(true);   // Add a loading state

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users/check-session', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setActiveUser(data.user); 
        } else {
          setActiveUser(null); 
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setActiveUser(null);
      } finally {
        setIsLoading(false); 
      }
    };

    checkUser();
  }, []);

  if (isLoading) {
    return <div className="loading-screen">Loading Unsynth...</div>;
  }
  return (
    <>
      <Routes>
        <Route element={<ScrollToTopWrapper />}>
          {/* AUTH PAGES */}
          <Route path='/login' element={<Login setActiveUser={setActiveUser} />} />
          <Route path='/register' element={<Register />} />

          {/* MAIN PAGES (w/ Navbar and Sidebar) */}
          <Route element={<MainLayout activeUser={activeUser} setActiveUser={setActiveUser}/>}>
            <Route path='/' element={<Home />}></Route>
            <Route path='/artists' element={<Artists />}></Route>
            <Route path='/profile/:user_id' element={<UserProfile />}></Route>
            <Route path='/artists/artist-profile/:artist_id' element={<ArtistProfile />}></Route>
            <Route path="/artists/artist-profile/:artist_idsongs/:song_id" element={<SongProfile />} />
            <Route path ="/albums/:album_id" element={<AlbumProfile />} />
            <Route path ="/songs/:song_id" element={<SongProfile />} />
          </Route>

          {/* SECONDARY PAGES (w/ Navbar) */}
          <Route element={<SecondLayout activeUser={activeUser} setActiveUser={setActiveUser}/>}>
            <Route path='/artist-view/:artist_id' element={<ArtistView />}></Route>
            <Route path='/about' element={<AboutUnsynth />} />
          </Route>

        </Route>
      </Routes>
    </>
  )
}

export default App
