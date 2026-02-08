import Home from '../pages/Home.jsx'
import Artists from '../pages/Artists.jsx'
import UserProfile from '../pages/UserProfile.jsx'
import "./MainContent.css"

function MainContent({ activePage, setActivePage, openModal }) {
    return (
        <div className="content">
            {activePage.page === "home" && <Home setActivePage={setActivePage}/>}
            {activePage.page === "artists" && <Artists openModal={openModal} />}
            {/* activePage === "create" && <Create />} */}

            {activePage.page === "user" && <UserProfile user_id={activePage.params.id} setActivePage={setActivePage} />}
        </div>
    )
}

export default MainContent