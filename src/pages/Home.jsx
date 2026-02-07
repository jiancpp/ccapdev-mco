import Review from '../components/Review'
import './Home.css'

function Home() {
    return (
        <div id='home'>
            <div className="buttons flex f-center">
                <div className="filters flex f-center">
                    <button className='selected'>Recent</button>
                    <button>Trending</button>
                </div>
                <button className="review-button" onClick={() => setActivePage("log-in")}>Review +</button>
            </div>
            <Review username={"Torotottie"} 
                    reviewTitle={"HELOOO"}
                    reviewContent={"Lorem ipsum persona grata! Capsicum aurora borealis imperata. Dumighay ka man yari ka bansot."}/>
        </div>
    )
}

export default Home