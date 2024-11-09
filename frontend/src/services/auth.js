import axiosConfig from '../config/axiosConfig';

export const SignIn = (username, password) => {
    return axiosConfig.post("/api/auth/login", { username, password });
}

export const SignUp = (username, password) => {
    return axiosConfig.post("/api/auth/signup", { username, password });
}

export const allUsers = (id) => {
    return axiosConfig.get(`/api/auth/users/${id}`);
}

export const SingOut = (id) => {
    return axiosConfig.get(`/api/auth/signout/${id}`);
}
