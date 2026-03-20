import './Component.css'

function AlertBlock({ message, icon, bgColor, textColor }) {
    const displayMessage = message || "Error processing action."
    const displayIcon = icon || "bi-exclamation-circle-fill"
    return (
        <div className="alert-message" style={{background: bgColor, color: textColor}}>
            <span><i className={`bi ${displayIcon}`}></i> {displayMessage}</span>
        </div>
    )
}

export default AlertBlock