import React, { useEffect, useState } from "react";
import "../../styles/order.css";
import OrderService from "./orderService";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("active"); // active | hidden | canceled
  const [sortConfig, setSortConfig] = useState({ field: "", direction: "asc" });

  // Search fields
  const [customerId, setCustomerId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const fetchAllOrders = async () => {
      setLoading(true);
      const data = await OrderService.getActiveOrders();
      setOrders(data);
      setLoading(false);
    };

    useEffect(() => {
      fetchAllOrders();
    }, []);

  const handleSearch = () => {
    const filtered = orders.filter((order) => {
      const matchCustomer =
        !customerId || String(order.customerId).includes(customerId);
      const matchEmployee =
        !employeeId || String(order.employeeId).includes(employeeId);
      const matchDate =
        !orderDate || order.orderDate?.includes(orderDate.trim());
      return matchCustomer && matchEmployee && matchDate;
    });
    setOrders(filtered);
  };

  const handleClearFilter = () => {
    //  setSearchOrderId("");
     // setSearchProductId("");
      setSortConfig({ field: "", direction: "asc" });
      fetchAllOrders(); // reload full list
    };

  // === SORT BY DATE or TOTAL AMOUNT ===
   const handleSort = async (field) => {
     let newDirection =
       sortConfig.field === field && sortConfig.direction === "asc"
         ? "desc"
         : "asc";
     setSortConfig({ field, direction: newDirection });

     let sortedData = [];
     if (field === "buyDate") {
       sortedData = await OrderService.getSortedByBuyDate(newDirection);
     } else if (field === "totalAmount") {
       sortedData = await OrderService.getSortedByTotalAmount(newDirection);
     }

     setOrders(sortedData);
   };

  return (
    <div>

      <div className="header">
        <h1>Quản lý Đơn hàng</h1>
        <button className="back-button">
          <span>←</span> Trở lại
        </button>
      </div>

      <div className="content">
        {/* --- Search Section --- */}
        <div className="search-section">
          <div className="search-group">
            <label>
              <span className="search-icon"></span> Mã KH
            </label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Nhập mã khách hàng..."
            />
            <span className="clear-filter" onClick={handleClearFilter}>
              ✕ clear filter
            </span>
          </div>

          <div className="search-group">
            <label>
              <span className="list-icon"></span> Mã NV
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Nhập mã nhân viên..."
            />
          </div>

          <div className="search-group">
            <label>
              <span className="calendar-icon"></span> Ngày mua
            </label>
            <input
              type="text"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>

        {/* --- Buttons --- */}
        <div className="button-group">
          <button className="search-button" onClick={handleSearch}>
            🔍 Tìm kiếm
          </button>
          <button className="add-button">➕ Thêm mới</button>
          <button
            className="search-button"
            onClick={() => setViewType("active")}
            style={{
              backgroundColor: viewType === "active" ? "#2d6b3d" : "#6b9d7a",
            }}
          >
            ✅ Đang hoạt động
          </button>
          <button
            className="search-button"
            onClick={() => setViewType("hidden")}
            style={{
              backgroundColor: viewType === "hidden" ? "#2d6b3d" : "#6b9d7a",
            }}
          >
            🙈 Ẩn
          </button>
          <button
            className="search-button"
            onClick={() => setViewType("canceled")}
            style={{
              backgroundColor: viewType === "canceled" ? "#2d6b3d" : "#6b9d7a",
            }}
          >
            ❌ Đã hủy
          </button>
        </div>

        {/* --- Table --- */}
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã KH</th>
                <th>Mã NV</th>
                <th
                    className={`sortable ${
                        sortConfig.field === "buyDate" ? sortConfig.direction : ""
                    }`}
                        onClick={() => handleSort("buyDate")}
                    >
                        Ngày mua
                    </th>
                 <th
                    className={`sortable ${
                        sortConfig.field === "totalAmount" ? sortConfig.direction : ""
                    }`}
                        onClick={() => handleSort("totalAmount")}
                    >
                        Tổng tiền
                    </th>
                <th>Giảm giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customerId}</td>
                    <td>{order.employeeId}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.totalAmount}</td>
                    <td>{order.discount}%</td>
                    <td>
                      <div className="actions">
                        <button className="icon-button edit-icon" title="Sửa">
                          📝
                        </button>

                        {/* Hide order */}
                        <button className="icon-button hide-icon" title="Ẩn đơn hàng">
                            🙈
                        </button>

                        {/* Cancel order */}
                        <button className="icon-button cancel-icon" title="Hủy đơn hàng">
                            ❌
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* --- Pagination Placeholder (future use) --- */}
        <div className="pagination">
          <button>«</button>
          <button className="active">1</button>
          <button>2</button>
          <button>»</button>
        </div>
      </div>
    </div>
  );
}
