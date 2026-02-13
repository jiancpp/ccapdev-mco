import { useNavigate } from 'react-router-dom'
import './AboutUnsynth.css'

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
                    <button onClick={() => navigate("/")}>START SHARING</button>
                </div>
                <div className='linear-border'></div>
            </div>
            <div className="about">
                <div className="container">
                    <h1>About un<span>s<span className="yn">y</span><span className="nth">nth</span></span></h1>
                    <p>Unsynth is a platform for the music community to explore, review, and share insights on their favorite artists, albums, and songs.</p>
                </div>
                <div className="record-disc">
                    <div className="c2">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUnsynth