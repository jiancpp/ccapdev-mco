import { useState, useEffect } from 'react'    
import { useOutletContext } from 'react-router-dom'          
import './Artists.css'

import ArtistBlock from '../components/ArtistBlock'
import { dummyArtists } from '../data/dummyArtists'

function Artists() {
    const { openModal } = useOutletContext()

    const [artists, setArtists] = useState([]);

    // Simulates API Fetching
    useEffect(() => {
        setArtists(dummyArtists)
    }, [])

    return (
        <div id='artists'>
            <div className="buttons flex f-center">
                <div className="filters flex f-center">
                    <button className='selected'>Pop</button>
                    <button>OPM</button>
                </div>
                <button className="review-button" onClick={openModal}>Review +</button>
            </div>
            <div className="blocks">
                {artists.map((artist) => (
                    <ArtistBlock 
                        key={artist._id} 
                        artist={artist}/>
                ))}
            </div>
            
        </div>
    )
}

export default Artists