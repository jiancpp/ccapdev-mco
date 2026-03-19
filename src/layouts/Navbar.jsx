import { useLocation, useNavigate } from "react-router-dom";
import './Navbar.css'
import { useState } from "react";


function Navbar({ activeUser, setActiveUser }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [openSettings, setOpenSettings] = useState("hidden");

    return (
        <div className="nav-container">
            <nav>
                <div
                    className={`profile-settings-modal ${openSettings}`}
                    onMouseLeave={() => setOpenSettings("hidden")}>
                    <ul>
                        <li onClick={() => activeUser && navigate(`/profile/${activeUser._id}`)}>View Profile</li>
                        <li onClick={
                            async () => {
                                try {
                                    const response = await fetch('http://localhost:5001/api/users/logout', {
                                        method: 'POST',
                                        credentials: 'include'
                                    });

                                    if (response.ok) {
                                        setActiveUser(null);
                                        navigate('/');
                                    }
                                } catch (err) {
                                    console.error("Logout failed", err);
                                }
                            }
                        }>Logout</li>
                    </ul>
                </div>
                <div className="logo flex" onClick={() => {
                    setActiveUser(null)
                    navigate("/");
                }}>
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="" className="logo flex" />
                </div>
                <div className="buttons flex">
                    {
                        pathname.startsWith("/artist-view") ?
                            (
                                <div className="login-btn" onClick={() => navigate("/")}>Log Out</div>
                            ) :
                            activeUser ?
                                (
                                    <>
                                        <i id='notifications' className="bi bi-bell-fill"></i>
                                        <div
                                            id="profile-pic"
                                            title='Open settings menu'
                                            onClick={() => setOpenSettings("visible")}>
                                            {activeUser ?
                                                (<img src={activeUser.avatar}></img>) : ""
                                            }
                                        </div>
                                    </>
                                ) :
                                (
                                    <div className="login-btn" onClick={() => navigate("/login")}>Log-in</div>
                                )
                    }

                </div>
            </nav>
        </div>
    )
}

export default Navbar