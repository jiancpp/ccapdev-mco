import { useNavigate } from "react-router-dom";
import './Navbar.css'


function Navbar({ activeUser }) {
    const showLogin = () => useNavigate("/login");

    return (
        <div className="nav-container">
            <nav>
                <div className="logo flex">
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="" className="logo flex" />
                </div>
                <div className="buttons flex">
                    <i id='notifications' className="bi bi-bell-fill"></i>
                    <div 
                        id="profile-pic" 
                        title='Open settings menu'
                        onClick={ showLogin }>
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