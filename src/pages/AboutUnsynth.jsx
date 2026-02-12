import { useNavigate } from 'react-router-dom'
import './AboutUnsynth.css'

function AboutUnsynth() {
    const navigate = useNavigate();
    return (
        <div className='about-page-container'>
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
                <h1>un<span>synth</span></h1>
                <p>Review songs, albums, and artists. Share your take, <em>unsynthesized</em>.</p>
                <button onClick={() => navigate("/")}>START SHARING</button>
            </div>

            <div className='linear-border'></div>
        </div>
    )
}

export default AboutUnsynth