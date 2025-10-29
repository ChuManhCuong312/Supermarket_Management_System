import axios from "axios";

const API_URL = "http://localhost:8080/api/suppliers";

const supplierService = {
    getById: (id) => axios.get(`${API_URL}/${id}`).then(res => res.data),
    searchByName: (name) => axios.get(`${API_URL}/search?name=${encodeURIComponent(name)}`).then(res => res.data.data || []),
};

export default supplierService;