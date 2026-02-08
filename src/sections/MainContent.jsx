import Home from '../pages/Home.jsx'
import Artists from '../pages/Artists.jsx'
import UserProfile from '../pages/UserProfile.jsx'
import ArtistProfile from '../pages/ArtistProfile.jsx'
import "./MainContent.css"

function MainContent({ activePage, setActivePage, openModal }) {
    return (
        <div className="content">
            {activePage.page === "home" && <Home setActivePage={setActivePage} openModal={openModal} />}
            {activePage.page === "artists" && <Artists openModal={openModal} setActivePage={setActivePage} />}
            {/* activePage === "create" && <Create />} */}

            {activePage.page === "user" && <UserProfile user_id={activePage.params.id} setActivePage={setActivePage} />}
            {activePage.page === "artist" && <ArtistProfile artist_id={activePage.params.id} setActivePage={setActivePage} />}
        </div>
    )
}

export default MainContent