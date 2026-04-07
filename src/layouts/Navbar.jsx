import { useLocation, useNavigate } from "react-router-dom";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5"; // Ionicons version
import './Navbar.css'
import { act, useState } from "react";
import { BASE_URL } from "../api/api";

function Navbar({ activeUser, setActiveUser }) {
    const navigate = useNavigate();
    const [openSettings, setOpenSettings] = useState("hidden");
    return (
        <div className="nav-container">
            <nav>
                <div
                    className={`profile-settings-modal ${openSettings}`}
                    onMouseLeave={() => setOpenSettings("hidden")}>
                    <ul>
                        {activeUser && (
                            <li onClick={() => {
                                if (activeUser?.role === 'artist') {
                                    navigate(`/artist-view/${activeUser._id}`);
                                    return;
                                };
                                navigate(`/profile/${activeUser._id}`)
                            }}>
                                <span className="profile avatar-picture"
                                    style={{
                                        backgroundImage: activeUser ? `url(${activeUser?.avatar})` : undefined,
                                    }}>
                                </span>
                                <div>
                                    <b>{activeUser?.username}</b><br/>
                                    <span style={{
                                        fontSize: 'var(--fs-sm)',
                                        color: 'var(--text-muted)'                
                                    }}>
                                        View Profile
                                    </span>
                                </div>
                            </li> 
                        )}
                        <li 
                            style={{
                                fontSize: 'var(--fs-sm)',
                                color: 'var(--text-muted)'                
                            }}
                            onClick={() => navigate("/home")}>
                            Go to Feed
                        </li>
                        <li 
                            style={{
                                fontSize: 'var(--fs-sm)',
                                color: 'var(--text-muted)'                
                            }}
                            onClick={
                            async () => {
                                try {
                                    const response = await fetch(`${BASE_URL}/users/logout`, {
                                        method: 'POST',
                                        credentials: 'include'
                                    });

                                    if (response.ok) {
                                        setActiveUser(null);
                                        navigate('/');
                                        window.location.reload();
                                    }
                                } catch (err) {
                                    console.error("Logout failed", err);
                                }
                            }
                        }>Logout</li>
                    </ul>
                </div>
                <div className="logo flex" onClick={() => {
                    navigate("/");
                }}>
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="" className="logo flex" />
                </div>
                <div className="buttons flex">
                    {
                        activeUser ? 
                        (
                            <>
                                <span
                                    id='notifications' 
                                    onClick={() => navigate(`/user/notifications/${activeUser._id}`)}
                                    > 
                                    <IoNotifications />
                                </span>
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