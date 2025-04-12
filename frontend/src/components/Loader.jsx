import 'bootstrap/dist/css/bootstrap.min.css'

const Loader = () => {
    return (
        <div className="spinner-border" role="status" style={{
            width : "100px", 
            height : "100px",
            fontSize : "2em"
        }}>
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}

export default Loader;