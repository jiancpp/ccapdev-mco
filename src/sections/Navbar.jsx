import { useNavigate } from "react-router-dom";
import './Navbar.css'
import { useState } from "react";


function Navbar({ activeUser, setActiveUser }) {
    const navigate = useNavigate();
    const [openSettings, setOpenSettings] = useState("hidden");

    return (
        <div className="nav-container">
            <nav>
                <div 
                    className={`profile-settings-modal ${openSettings}`} 
                    onMouseLeave={ () => setOpenSettings("hidden")}>
                    <ul>
                        <li onClick={() => activeUser && navigate(`/profile/${activeUser._id}`)}>View Profile</li>
                        <li onClick={() => navigate("/login")}>Logout</li>
                    </ul>
                </div>
                <div className="logo flex" onClick={ () => navigate("/about")}>
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="" className="logo flex" />
                </div>
                <div className="buttons flex">
                    <i id='notifications' className="bi bi-bell-fill"></i>
                    <div 
                        id="profile-pic" 
                        title='Open settings menu'
                        onClick={ () => setOpenSettings("visible") }>
                        { activeUser !== null ?
                          (<img src={activeUser.avatar}></img>) : ""
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar