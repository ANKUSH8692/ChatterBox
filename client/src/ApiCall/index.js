import axios from "axios";

export const BASE_URL = "https://chatterbox-server-5pum.onrender.com";
export const axiosInstance =axios.create({
    headers: {
        authorization:`Bearer ${localStorage.getItem('token')}`
    }
});



