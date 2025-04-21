import {getCookie} from "../utils/GetCookie";
import axios from "axios";

const API_URL = "https://127.0.0.1:8000/api/auth";

export const setMyInfo = (nickname, bio) => {
    const token = getCookie('access');
    return axios.put(
        `${API_URL}/user/profile/`,
        {
            nickname,
            bio,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
};

export const GetMyInfo = () => {
    const token = getCookie('access');
    return axios.get(
        `${API_URL}/user/profile/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
};