import './Component.css'

function AlertBlock({ message, icon, bgColor, textColor, status = null}) {
    const displayMessage = message || "Error processing action."
    const displayIcon = icon || "bi-exclamation-circle-fill"

    if (status) {
        bgColor = status === 'success' ? 'white' : '#f8d7da'; // Light green / Light red
        textColor = status === 'success' ? '#155724' : '#721c24'; // Dark green / Dark red
    }
    return (
        <div className="alert-message" style={{backgroundColor: bgColor, color: textColor}}>
            <span><i className={`bi ${displayIcon}`}></i> {displayMessage}</span>
        </div>
    )
}

export default AlertBlock