import {getCookie} from "../utils/GetCookie";
import axios from "axios";

const API_URL = "https://127.0.0.1:8000/api/tasks";

export const CreteTask = (formData) => {
    const token = getCookie('access');
    return axios.post(
        `${API_URL}/createtask/`,
        {...formData},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
};

export const GetTasks = () => {
    const token = getCookie('access');
    return axios.get(
        `${API_URL}/gettasks/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
};

export const StopTask = (task_id) => {
    const token = getCookie('access');
    return axios.post(
        `${API_URL}/stoptask/`,
        {task_id: task_id},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
};

export const DeleteTask = (task_id) => {
    const token = getCookie('access');
    return axios.delete(`${API_URL}/deletetask/${task_id}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
};

export const InferenceTask = (formData) => {
    const token = getCookie('access');
    return axios.post(
        `${API_URL}/inference/`,
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
        `${API_URL}/inference/download/${filename}/`,
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



