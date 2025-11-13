


export default function Searchbar({searchKey,setSearchKey}){
    return(
        <div className="user-search">
            <input type="text" 
            className="user-input"
            value={searchKey} 
            onChange={(e)=>setSearchKey(e.target.value)}
            />
            <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
        </div>
    );
}