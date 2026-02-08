import "./Sidebar.css"

function Sidebar({activePage, setActivePage, openModal}) {
    return (
        <div className="sidebar">
            <button className={activePage.page==="home" || activePage.page==="user"  ? "nav-button current-page" : "nav-button"} 
                    onClick={() => setActivePage({ page: "home", params: {} })}>
                <i className="bi bi-house-fill"></i>
                <span>Home</span>
            </button>
        
            <button className={activePage.page==="artists" ? "nav-button current-page" : "nav-button"} 
                    onClick={() => setActivePage({ page: "artists", params: {} })}>
                    <i className="bi bi-people-fill"></i>
                <span>Artists</span>
            </button>

            <button className={activePage.page==="log-in" ? "nav-button current-page" : "nav-button"} 
                onClick={() => setActivePage({ page: "log-in", params: {} })}>                
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