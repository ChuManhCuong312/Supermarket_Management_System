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

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search fields
  const [customerId, setCustomerId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ customerId: "", employeeId: "", orderDate: "" });

  // Cache for original data (for sorting)
  const [originalOrders, setOriginalOrders] = useState([]);
  const [originalSearchResults, setOriginalSearchResults] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const fetchAllOrders = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      let data;

      if (isSearching) {
        // Search with pagination
        if (viewType === "active") {
          data = await OrderService.searchActiveOrdersByPage(
            searchCriteria.customerId || null,
            searchCriteria.employeeId || null,
            searchCriteria.orderDate || null,
            pageNum,
            size
          );
        } else {
          data = await OrderService.searchDeletedOrdersByPage(
            searchCriteria.customerId || null,
            searchCriteria.employeeId || null,
            searchCriteria.orderDate || null,
            pageNum,
            size
          );
        }
        setOriginalSearchResults(data.content);
      } else {
        // Normal pagination
        if (viewType === "active") {
          data = await OrderService.getActiveOrdersByPage(pageNum, size);
        } else {
          data = await OrderService.getDeletedOrdersByPage(pageNum, size);
        }
        setOriginalOrders(data.content);
      }

      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng.");
      toast.error("❌ Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders(page);
  }, [page, size, viewType, isSearching, searchCriteria]);

  const handleSearch = () => {
    if (!customerId && !employeeId && !orderDate) {
      toast.warn("⚠️ Vui lòng nhập ít nhất một tiêu chí tìm kiếm!");
      return;
    }

    setSearchCriteria({ customerId, employeeId, orderDate });
    setIsSearching(true);
    setSortConfig({ field: "", direction: "asc" });
    setPage(0); // Reset to first page
  };

  const handleClearFilter = () => {
    setCustomerId("");
    setEmployeeId("");
    setOrderDate("");
    setSearchCriteria({ customerId: "", employeeId: "", orderDate: "" });
    setIsSearching(false);
    setSortConfig({ field: "", direction: "asc" });
    setPage(0);
  };

  const handleSort = (field) => {
    let newDirection;

    if (sortConfig.field !== field) {
      newDirection = "asc";
    } else if (sortConfig.direction === "asc") {
      newDirection = "desc";
    } else if (sortConfig.direction === "desc") {
      newDirection = "";
    }

    setSortConfig({ field: newDirection ? field : "", direction: newDirection });

    if (!newDirection) {
      // Reset sort - restore from cache
      if (isSearching) {
        setOrders(originalSearchResults);
      } else {
        setOrders(originalOrders);
      }
      return;
    }

    // Sort current page data
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
    setSearchCriteria({ customerId: "", employeeId: "", orderDate: "" });
    setIsSearching(false);
    setSortConfig({ field: "", direction: "asc" });
    setPage(0);
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
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
            <p>{error}</p>
          </div>
        ) : (
          <>
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
                    <td colSpan={viewType === "deleted" ? "8" : "7"} style={{ textAlign: "center" }}>
                      {isSearching
                        ? "Không tìm thấy đơn hàng nào."
                        : viewType === "active"
                          ? "Không có đơn hàng nào."
                          : "Không có đơn hàng đã xóa."}
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

            {/* Pagination Info */}
            {totalElements > 0 && (
              <div style={{
                textAlign: "center",
                padding: "10px 0",
                color: "#666",
                fontSize: "14px"
              }}>
                Hiển thị {orders.length} / {totalElements} đơn hàng
              </div>
            )}
          </>
        )}

        {/* --- Pagination Controls --- */}
        <div className="pagination">
          {/* First page button */}
          <button
            onClick={() => setPage(0)}
            disabled={page === 0}
            title="Trang đầu"
          >
            «
          </button>

          {/* Previous page button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            title="Trang trước"
          >
            ‹
          </button>

          {/* Page numbers - Smart pagination (max 5 visible) */}
          {(() => {
            const maxVisible = 5;
            let startPage = 0;
            let endPage = totalPages;

            if (totalPages > maxVisible) {
              // Calculate start and end based on current page
              const halfVisible = Math.floor(maxVisible / 2);

              if (page <= halfVisible) {
                // Near the beginning
                startPage = 0;
                endPage = maxVisible;
              } else if (page >= totalPages - halfVisible - 1) {
                // Near the end
                startPage = totalPages - maxVisible;
                endPage = totalPages;
              } else {
                // In the middle
                startPage = page - halfVisible;
                endPage = page + halfVisible + 1;
              }
            }

            return [...Array(endPage - startPage)].map((_, i) => {
              const pageNum = startPage + i;
              return (
                <button
                  key={pageNum}
                  className={pageNum === page ? "active" : ""}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              );
            });
          })()}

          {/* Next page button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            title="Trang sau"
          >
            ›
          </button>

          {/* Last page button */}
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={page + 1 >= totalPages}
            title="Trang cuối"
          >
            »
          </button>

          {/* Page size selector */}
          <select
            value={size}
            onChange={(e) => {
              setSize(parseInt(e.target.value));
              setPage(0); // Reset to first page when changing size
            }}
            style={{ marginLeft: "10px" }}
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
          </select>
        </div>
      </div>
    </div>
  );
}