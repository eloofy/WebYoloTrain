import { useState } from 'react';
import {
    CheckEmail,
    registerUser,
    SendEmailCode,
    VerifyEmailCode,
    LoginUser,
    GetToken
} from '../services/authService';
import { useError } from '../context/ErrorContext';
import { AuthSteps } from '../constants/authSteps';
import loginStep from "../components/auth/LoginStep";

const useRegisterLogin = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [emailExists, setEmailExists] = useState(null);
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [step, setStep] = useState(AuthSteps.LANDING);
    const { setError } = useError();

    const handleLogin = async () => {
        try {
            await LoginUser({ email, password });

            await requestCode(email);
            setStep(AuthSteps.VERIFY_CODE); // 4 или FINISH
        } catch {
            setError('Bad code or password');
        }
    };

    const handleRegister = async (e) => {
        try {
            e.preventDefault();

            // await registerUser({ email, password, nickname });
            await SendEmailCode( email );
            setError('')
            setStep(AuthSteps.VERIFY_CODE); // 3
        } catch {
            setError('Can not register');
        }
    };

    const verifyEmailCode = async () => {
        try {
            await VerifyEmailCode(email, code);
            setError('');

            let result;
            if (!emailExists) {
                result = await registerUser({ email, nickname, password });
            } else {
                result = await LoginUser({ email, password });
            }
            console.log("Результат аутентификации:", result);

            // Получаем токены; предполагается, что GetToken тоже возвращает сразу JSON-объект
            const tokenResult = await GetToken({ email });
            console.log("Полученные токены:", tokenResult);

            // Устанавливаем cookies
            document.cookie = `access=${tokenResult.data.access}; path=/; max-age=100000000; SameSite=None; Secure;`;
            document.cookie = `refresh=${tokenResult.data.refresh}; path=/; max-age=10000000; SameSite=None; Secure;`;
            document.cookie = `nickname=${result.data.nickname}; path=/; max-age=10000000; SameSite=None; Secure;`;
            document.cookie = `email=${result.data.email}; path=/; max-age=10000000; SameSite=None; Secure;`;

            setStep(AuthSteps.SUCCESS);
        } catch (error) {
            console.error("Ошибка в verifyEmailCode:", error);
            setError('Bad code');
        }
    };

    const requestCode = async () => {
        try {
            await SendEmailCode(email);
        } catch {
            setError('Can not send code');
        }
    };

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await CheckEmail(email);
            const exists = res.data.exists;
            setEmailExists(exists);

            if (exists) {
                setStep(AuthSteps.LOGIN);
            } else {
                setStep(AuthSteps.FORM);
            }
        } catch {
            setError('Failed to verify email');
        }
    };


    return {
        step, setStep,
        email, setEmail,
        code, setCode,
        password, setPassword,
        nickname, setNickname,
        emailExists, setEmailExists,
        handleLogin,
        handleRegister,
        verifyEmailCode,
        requestCode,
        handleCheckEmail
    };
};

export default useRegisterLogin;