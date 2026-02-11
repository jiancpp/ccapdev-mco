import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css"

function Sidebar({ openModal }) {
    const navigate = useNavigate();
    const location = useLocation();

    const goToHome = () => navigate("/");
    const goToArtists = () => navigate("/artists");
    const goToLogIn = () => navigate("/login")

    const currentPath = location.pathname; // track current active page

    return (
        <div className="sidebar">
            <button className={ currentPath === "/" || currentPath.startsWith("/profile") ? "nav-button current-page" : "nav-button" } 
                    onClick={ goToHome }>
                <i className="bi bi-house-fill"></i>
                <span>Home</span>
            </button>
        
            <button className={ currentPath.startsWith("/artists") ? "nav-button current-page" : "nav-button"} 
                    onClick={ goToArtists }>
                    <i className="bi bi-people-fill"></i>
                <span>Artists</span>
            </button>

            <button className={ currentPath === "/login" ? "nav-button current-page" : "nav-button"} 
                onClick={ goToLogIn }>                
                <i className="bi bi-bar-chart-line-fill"></i>
                <span>Charts</span>
            </button>
            <button className="review-button review-button-dynamic" onClick={openModal}>
                <span>Review +</span>
            </button>
        </div>        
    )
}

export default Sidebar;