import axios from "axios";

const API_URL = "http://localhost:8080/api/imports";

const importService = {
    // 🧾 Lấy danh sách import (phân trang)
    getAll: (page = 0, size = 10) =>
        axios.get(`${API_URL}?page=${page}&size=${size}`),

    // 🔍 Lấy 1 import theo ID
    getById: (id) => axios.get(`${API_URL}/${id}`),

    // ➕ Tạo mới import
    create: (data) => axios.post(API_URL, data),

    // 🔄 Cập nhật import
    update: (id, data) => axios.put(`${API_URL}/${id}`, data),

    // ❌ Xóa import
    remove: (id) => axios.delete(`${API_URL}/${id}`),

    // 📅 Lọc theo ngày
    filterByDate: (startDate, endDate, sortOrder = "asc") =>
        axios.get(`${API_URL}/filter/date`, {
            params: { startDate, endDate, sortOrder },
        }),

    // 💰 Lọc theo tổng tiền
    filterByAmount: (minAmount, maxAmount, sortOrder = "asc") =>
        axios.get(`${API_URL}/filter/amount`, {
            params: { minAmount, maxAmount, sortOrder },
        }),
};

export default importService;
