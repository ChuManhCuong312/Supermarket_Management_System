import React, { useEffect, useState } from "react";
import "../../styles/order.css";
import OrderService from "./orderService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import OrderForm from "./OrderForm";

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

  const [showForm, setShowForm] = useState(false);

  const fetchAllOrders = async () => {
      setLoading(true);
      const data = await OrderService.getActiveOrders();
      setOrders(data);
      setLoading(false);
    };

    useEffect(() => {
      fetchAllOrders();
    }, []);

  const handleSearch = async () => {
    if (!customerId && !employeeId && !orderDate) {
      toast.warn("Vui lòng nhập ít nhất một tiêu chí tìm kiếm!");
      return;
    }

    setLoading(true);
    try {
      const data = await OrderService.searchOrders(customerId, employeeId, orderDate);
      setOrders(data);
    } catch (err) {
      console.error("Error searching orders:", err);
      setError("Không thể tìm kiếm đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setCustomerId("");
    setEmployeeId("");
    setOrderDate("");
    setSortConfig({ field: "", direction: "asc" });
    fetchAllOrders(); // reload the default view (active, hidden, or canceled)
  };

  // === SORT BY DATE or TOTAL AMOUNT ===
   const handleSort = async (field) => {
     let newDirection =
       sortConfig.field === field && sortConfig.direction === "asc"
         ? "desc"
         : "asc";
     setSortConfig({ field, direction: newDirection });

     // Check if user has active filters
     const hasActiveFilters = customerId || employeeId || orderDate;

     if (hasActiveFilters) {
       // Local sort with proper date handling
       const sortedData = [...orders].sort((a, b) => {
         let aValue = a[field];
         let bValue = b[field];

         // Handle field name mismatch: buyDate in sort but orderDate in data
         if (field === "buyDate") {
           aValue = a["orderDate"] || a["buyDate"];
           bValue = b["orderDate"] || b["buyDate"];
         }

         // Convert to Date objects if sorting by date
         if (field === "buyDate" || field === "orderDate") {
           aValue = new Date(aValue);
           bValue = new Date(bValue);
         }

         if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
         if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
         return 0;
       });
       setOrders(sortedData);
     } else {
       // Server-side sort when no filters are active
       let sortedData = [];
       if (field === "buyDate" || field === "orderDate") {
         sortedData = await OrderService.getSortedByBuyDate(newDirection);
       } else if (field === "totalAmount") {
         sortedData = await OrderService.getSortedByTotalAmount(newDirection);
       }
       setOrders(sortedData);
     }
   };

 const handleAdd = () => {
   setShowForm(true);
 };

  const handleEdit = (id) => {
    toast.info(`Chỉnh sửa chi tiết đơn hàng ID: ${id}`);
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
          <button className="add-button" onClick={handleAdd}>
            ➕ Thêm mới
          </button>
          <button className="archive-button" onClick={handleAdd}>
                      🗃️ Xem đơn hàng lưu trữ
                    </button>
        </div>
        {showForm && (
          <OrderForm
            onSuccess={() => {
              setShowForm(false);
              fetchAllOrders(); // refresh list
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
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

                      <button
                        className="icon-button delete-icon"
                        onClick={() => handleDelete(detail.orderDetailId)}
                        title="Xóa"
                      >
                        🗑️
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
