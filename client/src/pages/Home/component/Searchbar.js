import "./../../../home.css"
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function Searchbar({searchKey,setSerachKey}){
    return(
        <div className="user-search">
            <input type="text" value={searchKey} onChange={(e)=>{setSerachKey(e.target.value)}}className="user-input"/>
            <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
        </div>
    );
}