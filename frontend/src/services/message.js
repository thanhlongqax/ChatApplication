import axiosConfig from '../config/axiosConfig';

export const addMessage = (from, to, content) => {
    return axiosConfig.post("/api/messages/new", { from, to, content });
}

export const getMessage = (from, to) => {
    return axiosConfig.post("/api/messages/retrieve", { from, to });
}
