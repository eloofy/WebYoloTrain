import axios from "axios";

const API_URL = "https://127.0.0.1:8000/api/auth";

export const SendEmailCode = (email) => axios.post(`${API_URL}/sendcode/`, { email })

export const VerifyEmailCode = (email, code) => axios.post(`${API_URL}/verifycode/`, { email, code })

export const CheckEmail = (email) => axios.post(`${API_URL}/check-email/`, { email })

export const registerUser = (userData) => axios.post(`${API_URL}/register/`,  userData);

export const LoginUser = (userData) => axios.post(`${API_URL}/login/`, userData);

export const GetToken = (userData) => axios.post(`${API_URL}/gettoken/`, userData);