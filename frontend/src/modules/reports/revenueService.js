import axiosClient from '../../api/axiosClient';

const revenueService = {
  // Lấy tổng doanh thu
  getTotalRevenue: (startDate, endDate) => {
    return axiosClient.get('/revenue/total', {
      params: {
        startDate,
        endDate
      }
    });
  },

  // Lấy doanh thu theo ngày
  getDailyRevenue: (startDate, endDate) => {
    return axiosClient.get('/revenue/daily', {
      params: {
        startDate,
        endDate
      }
    });
  },

  // Lấy doanh thu theo tháng
  getMonthlyRevenue: (startDate, endDate) => {
    return axiosClient.get('/revenue/monthly', {
      params: {
        startDate,
        endDate
      }
    });
  },

  // Lấy top sản phẩm theo doanh thu
  getTopProductsByRevenue: (startDate, endDate, limit) => {
    return axiosClient.get('/revenue/products/top-by-revenue', {
      params: {
        startDate,
        endDate,
        limit
      }
    });
  },

  // Lấy top sản phẩm theo số lượng
  getTopProductsByQuantity: (startDate, endDate, limit) => {
    return axiosClient.get('/revenue/products/top-by-quantity', {
      params: {
        startDate,
        endDate,
        limit
      }
    });
  },

  // Lấy doanh thu theo danh mục
  getRevenueByCategory: (startDate, endDate) => {
    return axiosClient.get('/revenue/categories', {
      params: {
        startDate,
        endDate
      }
    });
  }
};

export default revenueService;

