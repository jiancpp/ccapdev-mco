import './Component.css'

function NothingBlock(props) {
    const message = props.message || "Nothing here yet."
    return (
        <div className="nothing-block">
            <div><i className="bi bi-emoji-neutral"></i></div>
            <div>{message}</div>
        </div>
    )
}

export default NothingBlock