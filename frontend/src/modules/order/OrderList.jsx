import React, { useEffect, useState } from "react";
import "../../styles/order.css";
import OrderService from "./orderService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import OrderForm from "./OrderForm";
import OrderEditForm from "./OrderEditForm";
import DeleteOrderModal from "./DeleteOrderModal";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("active"); // active | deleted
  const [sortConfig, setSortConfig] = useState({ field: "", direction: "asc" });

  // Search fields
  const [customerId, setCustomerId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const fetchAllOrders = async () => {
    setLoading(true);
    if (viewType === "active") {
      const data = await OrderService.getActiveOrders();
      setOrders(data);
    } else {
      const data = await OrderService.getDeletedOrders();
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [viewType]);

  const handleSearch = async () => {
    if (!customerId && !employeeId && !orderDate) {
      toast.warn("Vui lòng nhập ít nhất một tiêu chí tìm kiếm!");
      return;
    }

    setLoading(true);
    try {
      // Only search in active orders, deleted orders don't have search API
      if (viewType === "active") {
        const data = await OrderService.searchOrders(customerId, employeeId, orderDate);
        setOrders(data);
      } else {
        // For deleted view, filter locally
        const allDeletedOrders = await OrderService.getDeletedOrders();
        const filtered = allDeletedOrders.filter(order => {
          const matchCustomer = !customerId || order.customerId?.toString() === customerId;
          const matchEmployee = !employeeId || order.employeeId?.toString() === employeeId;
          const matchDate = !orderDate || order.orderDate === orderDate;
          return matchCustomer && matchEmployee && matchDate;
        });
        setOrders(filtered);
      }
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
    fetchAllOrders();
  };

  const handleSort = async (field) => {
    let newDirection;

    if (sortConfig.field !== field) {
      newDirection = "asc";
    } else if (sortConfig.direction === "asc") {
      newDirection = "desc";
    } else if (sortConfig.direction === "desc") {
      newDirection = "";
    } else {
      newDirection = "asc";
    }

    setSortConfig({ field: newDirection ? field : "", direction: newDirection });

    const hasActiveFilters = customerId || employeeId || orderDate;

    if (!newDirection) {
      if (hasActiveFilters) {
        const data = await OrderService.searchOrders(customerId, employeeId, orderDate);
        setOrders(data);
      } else {
        fetchAllOrders();
      }
      return;
    }

    if (hasActiveFilters) {
      const sortedData = [...orders].sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (field === "buyDate") {
          aValue = a["orderDate"] || a["buyDate"];
          bValue = b["orderDate"] || b["buyDate"];
        }

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

  const handleEdit = (orderId) => {
    setEditingOrderId(orderId);
  };

  const handleDelete = (orderId) => {
    setDeletingOrderId(orderId);
  };

  const handleRestore = (orderId) => {
    confirmAlert({
      title: "Xác nhận khôi phục",
      message: "Bạn có chắc chắn muốn khôi phục đơn hàng này?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await OrderService.restoreOrder(orderId);
              toast.success("✅ Đã khôi phục đơn hàng!");
              fetchAllOrders();
            } catch (error) {
              console.error(error);
              toast.error("❌ Lỗi khi khôi phục đơn hàng!");
            }
          }
        },
        {
          label: "Không",
          onClick: () => {}
        }
      ]
    });
  };

  const toggleView = () => {
    setViewType(prev => prev === "active" ? "deleted" : "active");
    setCustomerId("");
    setEmployeeId("");
    setOrderDate("");
    setSortConfig({ field: "", direction: "asc" });
  };

  const getStatusLabel = (deletedType) => {
    if (deletedType === "CANCEL") return "Đã hủy";
    if (deletedType === "HIDE") return "Lưu trữ";
    return deletedType;
  };

  const getStatusColor = (deletedType) => {
    if (deletedType === "CANCEL") return "#dc2626"; // Red
    if (deletedType === "HIDE") return "#fbbf24"; // Yellow
    return "#666";
  };

  return (
    <div>
      <div className="header">
        <div className="header-left">
          <span className="header-icon">🛒</span>
          <h2 className="header-title">
            {viewType === "active" ? "Quản lý đơn hàng" : "Đơn hàng đã xóa"}
          </h2>
        </div>
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
          {viewType === "active" && (
            <button className="add-button" onClick={handleAdd}>
              ➕ Thêm mới
            </button>
          )}
          <button className="archive-button" onClick={toggleView}>
            {viewType === "active" ? "🗑️ Xem đơn hàng đã xóa" : "📋 Xem đơn hàng hoạt động"}
          </button>
        </div>

        {showForm && (
          <OrderForm
            onSuccess={() => {
              setShowForm(false);
              fetchAllOrders();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingOrderId && (
          <OrderEditForm
            orderId={editingOrderId}
            onSuccess={() => {
              setEditingOrderId(null);
              fetchAllOrders();
            }}
            onCancel={() => setEditingOrderId(null)}
          />
        )}

        {deletingOrderId && (
          <DeleteOrderModal
            orderId={deletingOrderId}
            onSuccess={() => {
              setDeletingOrderId(null);
              fetchAllOrders();
            }}
            onCancel={() => setDeletingOrderId(null)}
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
                    sortConfig.field === "buyDate" && sortConfig.direction ? sortConfig.direction : ""
                  }`}
                  onClick={() => handleSort("buyDate")}
                >
                  Ngày mua
                </th>
                <th
                  className={`sortable ${
                    sortConfig.field === "totalAmount" && sortConfig.direction ? sortConfig.direction : ""
                  }`}
                  onClick={() => handleSort("totalAmount")}
                >
                  Tổng tiền
                </th>
                <th>Giảm giá</th>
                {viewType === "deleted" && <th>Trạng thái</th>}
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={viewType === "deleted" ? "9" : "8"} style={{ textAlign: "center" }}>
                    {viewType === "active" ? "Không có đơn hàng nào." : "Không có đơn hàng đã xóa."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customerId}</td>
                    <td>{order.employeeId}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.totalAmount?.toLocaleString()}</td>
                    <td>{order.discount}%</td>
                    {viewType === "deleted" && (
                      <td>
                        <span style={{
                          backgroundColor: getStatusColor(order.deletedType),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}>
                          {getStatusLabel(order.deletedType)}
                        </span>
                      </td>
                    )}
                    <td>
                      <div className="actions">
                        {viewType === "active" ? (
                          <>
                            <button
                              className="icon-button edit-icon"
                              onClick={() => handleEdit(order.orderId)}
                              title="Sửa"
                            >
                              📝
                            </button>
                            <button
                              className="icon-button delete-icon"
                              onClick={() => handleDelete(order.orderId)}
                              title="Xóa"
                            >
                              🗑️
                            </button>
                          </>
                        ) : (
                          <button
                            className="icon-button"
                            onClick={() => handleRestore(order.orderId)}
                            title="Khôi phục"
                            style={{ color: "#4CAF50", fontSize: "20px" }}
                          >
                            ↩️
                          </button>
                        )}
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