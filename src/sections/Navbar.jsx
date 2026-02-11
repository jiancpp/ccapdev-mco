import { useNavigate } from "react-router-dom";
import './Navbar.css'


function Navbar() {
    const showLogin = () => useNavigate("/login");

    return (
        <div className="nav-container">
            <nav>
                <div className="logo flex">
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="" className="logo flex" />
                </div>
                <div className="buttons flex">
                    <i id='notifications' className="bi bi-bell-fill"></i>
                    <span 
                        id="profile-pic" 
                        title='Open settings menu'
                        onClick={ showLogin }></span>
                </div>
            </nav>
        </div>
    )
}

export default Navbar