import './Component.css'

function LoadingBlock(props) {
    const message = props.message || ""
    return (
        <div className="loading-block">
            <div className="loading-frame"> 
                <div className="loading-overlay"></div>
            </div>
            <div className='message'>{message}</div>
        </div>
    )
}

export default LoadingBlock