// importService2.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/imports2"; // Thay đổi URL nếu backend khác

const getAllImports = async (page = 1, size = 10, sort = "none", sortBy = "importDate") => {
  const response = await axios.get(API_URL, {
    params: { page, size, sort, sortBy }
  });
  return response.data;
};

const createImport = async (importData) => {
  const response = await axios.post(API_URL, importData);
  return response.data;
};

const updateImport = async (importId, importData) => {
  const response = await axios.put(`${API_URL}/${importId}`, importData);
  return response.data;
};

const deleteImport = async (importId) => {
  const response = await axios.delete(`${API_URL}/${importId}`);
  return response.data;
};

const searchImports = async ({ startDate, endDate, page = 1, size = 10, sort = "asc", sortBy = "importDate" }) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: {
      startDate,
      endDate,
      page,
      size,
      sort,
      sortBy
    }
  });
  return response.data;
};


const importService2 = {
  getAllImports,
  createImport,
  updateImport,
  deleteImport,
  searchImports
};

export default importService2;
