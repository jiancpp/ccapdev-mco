import { useNavigate } from 'react-router-dom';
import './Component.css'

function BackButton() {
    const navigate = useNavigate();
    
    return (
        <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="bi bi-chevron-left"></i> Back
        </button>
    )
}

export default BackButton;