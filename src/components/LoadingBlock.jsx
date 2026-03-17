import './Component.css'

function LoadingBlock({ msg, padding }) {
    const pad = padding || "200px";
    const message = msg || ""
    return (
        <div className="loading-block" style={{ paddingTop: pad }}>
            <div className="loading-frame"> 
                <div className="loading-overlay"></div>
            </div>
            <div className='message'>{message}</div>
        </div>
    )
}

export default LoadingBlock