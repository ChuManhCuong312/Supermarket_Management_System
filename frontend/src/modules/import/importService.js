import axios from "axios";

const API_URL = "http://localhost:8080/api/imports";

const importService = {
    getAll: (page = 0, size = 10) =>
        axios.get(`${API_URL}?page=${page}&size=${size}`),
    getById: (id) => axios.get(`${API_URL}/${id}`),
    create: (data) => axios.post(API_URL, data),
    update: (id, data) => axios.put(`${API_URL}/${id}`, data),
    remove: (id) => axios.delete(`${API_URL}/${id}`),

    filterByDate: (startDate, endDate, sortOrder = "asc") =>
        axios.get(`${API_URL}/filter/date`, {
            params: { startDate, endDate, sortOrder },
        }),

    filterByAmount: (minAmount, maxAmount, sortOrder = "asc") =>
        axios.get(`${API_URL}/filter/amount`, {
            params: { minAmount, maxAmount, sortOrder },
        }),
};

export default importService;
