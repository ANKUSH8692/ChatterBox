import { useState } from "react";
import Searchbar from "./Searchbar.js";

import "./../../../home.css"

export default function SideBar(){
    const [searchKey,setSerachKey]=useState('');

    return (
        
        <div>
            <div className="app-sidebar">
                <Searchbar 
                    searchKey={setSerachKey}
                    setSerachKey={setSerachKey}

                />

            </div>
        </div>
    );
}