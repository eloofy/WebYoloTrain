import axios from "axios";
import { getCookie } from '../utils/GetCookie';

const API_URL = "https://127.0.0.1:8000/api/datasets"; // используем http, как в проекте


export const getMyDatasets = () => {
    const token = getCookie('access');
    return axios.get(`${API_URL}/getdatasets/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export const getPublicDatasets = () => {
    const token = getCookie('access');
    return axios.get(`${API_URL}/getdatasets/?is_public=true`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// URL для загрузки датасета (используется отдельно в XMLHttpRequest или fetch)
export const saveDatasets = `${API_URL}/upload-dataset/`;