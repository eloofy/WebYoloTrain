export const AuthSteps = {
    LANDING: 0,
    EMAIL: 1,        // Ввод email
    LOGIN: 2,
    FORM: 3,         // Ввод пароля или регистрационных данных
    SEND_CODE: 4,    // Отправка кода (если email существует)
    VERIFY_CODE: 5,  // Ввод кода
    SUCCESS: 6,      // Успех
};

export const alertContent = {
    success_register: 'Registration complete!',
    success_login: 'Sign in complete!',
};