import { useNavigate } from 'react-router-dom'
import './AboutUnsynth.css'

// DEPENDENCIES ICONS
import { FaReact, FaJsSquare, FaCss3Alt } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiCloudinary, SiNodedotjs, SiVite, SiBootstrap, SiRender, SiShieldsdotio} from 'react-icons/si';

function AboutUnsynth() {
    const navigate = useNavigate();
    return (
        <div className='about-page-container'>
            <div className="hero">
                <div className='header'>
                    <div className="background">
                        <div className="circle-element circle-l1">
                        </div>
                        <div className="circle-element circle-l2">
                        </div>
                        <div className="circle-element circle-r1">
                        </div>
                        <div className="circle-element circle-r2">
                        </div>
                    </div>
                    <h1>un<span>s<span className="yn">y</span><span className="nth">nth</span></span></h1>
                    <p>Review songs, albums, and artists. Share your take, <em>unsynthesized</em>.</p>
                    <button onClick={() => navigate('/home')}>START SHARING</button>
                </div>
                <div className='linear-divider'></div>
            </div>
            {/* <div className="section-divider"></div> */}
            <div className="about">
                <header>
                    <p>HOW IT WORKS</p>
                    <h1>From <span className="styled">Opinions</span> to <span className="styled">Discovery</span></h1>
                    <p className='description'>A community-driven platform where your musical insights help others find their next favorite track.</p>
                </header>
                <main>
                    <div className="feature-card">
                        <div className="feature-title">
                            <div className="feature-icon">
                                <i className='bi bi-chat-left-text-fill'></i>
                            </div>
                            <p><span>Share</span> your music take</p>
                        </div>
                        <p>Rate your latest listens and build a digital library of your musical journey.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-title">
                            <div className="feature-icon">
                                <i className='bi bi-music-note-beamed'></i>
                            </div>
                            <p><span>Discover</span> hidden gems</p>
                        </div>
                        <p>Explore new music using smart filters, and follow users and artists you love.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-title">
                            <div className="feature-icon">
                                <i className='bi bi-chat-heart-fill'></i>
                            </div>
                            <p><span>Connect</span> with others</p>
                        </div>
                        <p>Follow users, react to posts, and engage with a community that shares your taste.</p>
                    </div>
                </main>
            </div>
            <div className="dependencies">
                <header>
                    <p>WEBSITE TOOLS</p>
                    <h1>Tech Stack and Dependencies</h1>
                </header>
                <div className="dependencies-list">
                    <div className="dependencies-item">
                        <i><FaReact /></i> React
                    </div>
                    <div className="dependencies-item">
                        <i><SiVite /></i> Vite
                    </div>
                    <div className="dependencies-item">
                        <i><FaJsSquare /></i> JavaScript
                    </div>
                    <div className="dependencies-item">
                        <i><FaCss3Alt/></i> CSS
                    </div>
                    <div className="dependencies-item">
                        <i><SiNodedotjs/></i> Node.js
                    </div>
                    <div className="dependencies-item">
                        <i><SiExpress/></i> Express.js
                    </div>
                    <div className="dependencies-item">
                        <i><SiMongodb/></i> MongoDB/Mongoose
                    </div>
                    <div className="dependencies-item">
                        <i><SiRender/></i> Render.io
                    </div>
                    <div className="dependencies-item">
                        <img src="/assets/syncfusion.png" width="20" height="20" />SyncFusion RTE
                    </div>
                    <div className="dependencies-item">
                        <i><SiCloudinary /></i> Cloudinary
                    </div>
                    <div className="dependencies-item">
                        <i className="bi bi-shield-lock-fill"></i> bcrypt
                    </div>
                    <div className="dependencies-item">
                        <img src="/assets/lyrics.png" width="25" height="25" />lyrics.ovh API
                    </div>
                    <div className="dependencies-item">
                        <i><SiBootstrap /></i>Bootstrap Icons
                    </div>
                </div>
            </div>
            <footer>© 2026 Unsynth</footer>
        </div>
    )
}

export default AboutUnsynth