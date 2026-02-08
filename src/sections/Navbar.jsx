import './Navbar.css'

function Navbar() {
    return (
        <div className="nav-container">
            <nav>
                <div className="logo flex">
                    <img src="https://eepy-elo.github.io/font-hosting/unsynth-logo.png" alt="" className="logo flex" />
                </div>
                <div className="buttons flex">
                    <i id='notifications' class="bi bi-bell-fill"></i>
                    <span id="profile-pic"></span>
                </div>
            </nav>
        </div>
    )
}

export default Navbar