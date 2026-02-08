import Home from '../pages/Home.jsx'
import Artists from '../pages/Artists.jsx'
import "./MainContent.css"

function MainContent({ activePage }) {
    return (
        <div className="content">
            {activePage === "home" && <Home />}
            {activePage === "artists" && <Artists />}
            {/* activePage === "create" && <Create />} */}
        </div>
    )
}

export default MainContent