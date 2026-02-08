import "./Sidebar.css"

function Sidebar({activePage, setActivePage, openModal}) {
    return (
        <div className="sidebar">
            <button className={activePage==="home" ? "nav-button current-page" : "nav-button"} 
                    onClick={() => setActivePage("home")}>
                <i className="bi bi-house-fill"></i>
                <span>Home</span>
            </button>
        
            <button className={activePage==="artists" ? "nav-button current-page" : "nav-button"} 
                    onClick={() => setActivePage("artists")}>
                    <i className="bi bi-people-fill"></i>
                <span>Artists</span>
            </button>

            <button className={activePage==="log-in" ? "nav-button current-page" : "nav-button"} 
                onClick={() => setActivePage("log-in")}>                
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