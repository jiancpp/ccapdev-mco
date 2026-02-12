import {
  RichTextEditorComponent,
  Toolbar,
  Image,
  Link,
  HtmlEditor,
  QuickToolbar,
  Inject
} from '@syncfusion/ej2-react-richtexteditor';
import { InteractiveStarRating } from '../components/StarRating';
import { SearchBar } from '../components/SearchBar';
import { useState } from 'react';

import { dummySongs } from '../data/dummySongs';
import { dummyAlbums } from '../data/dummyAlbums';
import { dummyArtists } from '../data/dummyArtists';

import './ReviewModal.css';

function ReviewModal({ isOpen, onClose }) {
    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo']
    };

    const [selectedItem, setSelectedItem] = useState({
        title: "SILAKBO",
        artist_id: "a1",
        cover: "/assets/Silakbo.jpg"
    });

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <h2 className="modal-title">Write a Review</h2>

                <SearchBar 
                    songs={dummySongs} 
                    albums={dummyAlbums} 
                    artists={dummyArtists} 
                    onSelect={(item) => setSelectedItem(item)} 
                />

                <div className="review-row">
                    <div className="selected-card">
                        <img src={selectedItem.cover} />
                        <div className="card-info">
                            <p className="song-title">{selectedItem.title}</p>
                            <p className="artist-subtitle">
                                {dummyArtists.find(a => a._id === selectedItem.artist_id)?.name}
                            </p>
                        </div>
                    </div>

                    <div className="rating-section">
                        <p className="rating-label">Star Rating</p>
                        <InteractiveStarRating totalStars={5} />
                    </div>
                </div>

                <div className="input-group">
                    <input type="text" className="header-input" placeholder="Header" />
                    <RichTextEditorComponent 
                        className="review-rte" 
                        toolbarSettings={toolbarSettings} 
                        insertLinkSettings={{ target: 'body' }}
                        insertcoverSettings={{ target: 'body' }}
                        actionComplete={(args) => {
                            if (args.requestType === 'OpenDialog') {
                            }
                        }}
                    >
                        <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
                    </RichTextEditorComponent>
                </div>

                <div className="footer">
                    <button className="submit-btn" onClick={onClose}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal