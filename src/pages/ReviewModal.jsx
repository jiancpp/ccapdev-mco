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
import './ReviewModal.css';

function ReviewModal({ isOpen, onClose }) {
    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo']
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <h2 className="modal-title">Write a Review</h2>

                <div className="search-container">
                    <i className="bi bi-search search-icon"></i>
                    <input type="text" placeholder="Search songs, artists, and albums" />
                </div>

                <div className="review-row">
                    <div className="selected-card">
                        <img src="/public/assets/Silakbo.jpg" alt="Album" />
                        <div className="card-info">
                            <p className="song-title">SILAKBO</p>
                            <p className="artist-subtitle">Cup of Joe</p>
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
                        insertImageSettings={{ target: 'body' }}
                        // Add this to handle the "Table" and other dialogs too
                        actionComplete={(args) => {
                            if (args.requestType === 'OpenDialog') {
                            // This is a backup to ensure any dynamically opened dialog 
                            // targets the body
                            }
                        }}
                    >
                        {/* Inject the required feature modules */}
                        <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
                    </RichTextEditorComponent><div className="review-textarea">
                        
                    </div>
                </div>

                <div className="footer">
                    <button className="submit-btn" onClick={onClose}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal