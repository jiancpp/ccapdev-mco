import './Component.css'

function AlertBlock({ message, icon, bgColor, textColor, status = null, styling = null}) {
    const displayMessage = message || "Error processing action."
    const displayIcon = icon || "bi-exclamation-circle-fill"

    let finalBg = status === 'success' ? 'var(--success-light)' : 'var(--error-light)';
    let finalColor = status === 'success' ? 'var(--success-dark)' : 'var(--error-dark)';
    if (bgColor) finalBg = bgColor;
    if (textColor) finalColor = textColor;

    return (
        <div className="alert-message" style={{backgroundColor: finalBg, color: finalColor, ...styling}}>
            <span><i className={`bi ${displayIcon}`}></i> {displayMessage}</span>
        </div>
    )
}

export default AlertBlock