import {getCookie} from "../utils/GetCookie";
import axios from "axios";

const API_URL = "https://127.0.0.1:8000/api/inference";

export const InferenceTask = (formData) => {
    const token = getCookie('access');
    return axios.post(
        `${API_URL}/make-inference/`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
}

export const DownloadInferenceResult = async (filename) => {
    const token = getCookie('access');
    const response = await axios.get(
        `${API_URL}/download/${filename}/`,
        {
            responseType: 'blob', // ✅ нужно, чтобы axios не пытался парсить JSON
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // если используешь куки
        }
    );

    // создать ссылку и инициировать скачивание
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
};


export const GetInferenceHistory = async () => {
    const token = getCookie('access');
    return await axios.get(`${API_URL}/history/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const DeleteInferenceTask = async (id) => {
    const token = getCookie('access');
    return await axios.delete(`${API_URL}/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    });
};