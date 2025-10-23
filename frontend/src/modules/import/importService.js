import axios from "axios";

const API_URL = "http://localhost:8080/api/imports";

const importService = {
    getAll: (page = 0, size = 10) =>
        axios.get(`${API_URL}?page=${page}&size=${size}`).then(res => res.data),

    getById: (id) => axios.get(`${API_URL}/${id}`).then(res => res.data),

    create: (data) => axios.post(API_URL, data).then(res => res.data),

    update: (id, data) => axios.put(`${API_URL}/${id}`, data).then(res => res.data),

    delete: (id) => axios.delete(`${API_URL}/${id}`).then(res => res.data),

    filterByDate: (startDate, endDate, sortOrder = "asc") =>
        axios
            .get(`${API_URL}/filter/date`, { params: { startDate, endDate, sortOrder } })
            .then((res) => res.data),

    filterByAmount: (minAmount, maxAmount, sortOrder = "asc") =>
        axios
            .get(`${API_URL}/filter/amount`, { params: { minAmount, maxAmount, sortOrder } })
            .then((res) => res.data),
};

export default importService;
