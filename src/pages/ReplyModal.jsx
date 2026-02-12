import {
    RichTextEditorComponent,
    Toolbar,
    Image,
    Link,
    HtmlEditor,
    QuickToolbar,
    Inject
} from '@syncfusion/ej2-react-richtexteditor';
import './ReplyModal.css';
import '../components/Review.css';

function ReplyModal({ isOpen, onClose, }) {
    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo']
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content-wrapper">
                    <button className="close-btn" onClick={onClose}>&times;</button>

                    <h2 className="modal-title">Reply to Review</h2>

                    <div className="post">
                        <div className='post-content'>
                            <div className="profile">
                                <img src="/public/assets/mariemarrr.jpg" alt="test" />
                            </div>
                            <div className="review-details">
                                <div className='user'>
                                    <span
                                        className="username">
                                        Mariemarrr</span>  3hrs ago
                                </div>

                                <div className='title'>A modern classic</div>
                                <div className='rating'>
                                    {[...Array(5)].map((_, i) => (
                                        <i className="bi bi-star-fill" key={i}></i>
                                    ))}
                                    {[...Array(0)].map((_, i) => (
                                        <i className="bi bi-star-fill grey" key={i}></i>
                                    ))}
                                </div>

                                <div className="embed embed-album">
                                    <div className="album-cover">
                                        <img src="/public/assets/HarrysHouse.jfif" alt="test" />
                                    </div>
                                    <div className='album-details'>
                                        <span className='album-title'>"Sign of the Times"</span><br />
                                        <span className='icon'><i className="bi bi-disc-fill"></i></span>
                                        <span>Harry's House</span><br />
                                        <span className='icon'><i className="bi bi-person-fill"></i></span>
                                        <span>Harry Styles</span>
                                    </div>
                                </div>
                                <div className="description">Sign of the Times is Harry's 'Bohemian Rhapsody'. The build-up is incredible and the vocals are raw and powerful. This song never gets old.</div>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <input type="text" className="header-input" placeholder="Header" />
                        <RichTextEditorComponent
                            className="review-rte"
                            toolbarSettings={toolbarSettings}
                            insertLinkSettings={{ target: 'body' }}
                            insertImageSettings={{ target: 'body' }}
                            actionComplete={(args) => {
                                if (args.requestType === 'OpenDialog') {
                                }
                            }}
                        >
                            <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
                        </RichTextEditorComponent>
                    </div>

                    <div className="footer">
                        <button className="submit-btn" onClick={onClose}>Reply</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReplyModal