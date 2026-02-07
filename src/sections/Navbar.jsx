import './Navbar.css'

function Navbar() {
    return (
        <nav>
            <div className="logo flex">unsynth</div>
            <div className="buttons flex">
                <i id='notifications' class="bi bi-bell-fill"></i>
                <span id="profile-pic"></span>
            </div>
        </nav>
    )
}

export default Navbar