import React, { useEffect, useState } from "react";
import OrderDetailService from "./orderDetailService";
import "../../styles/orderdetail.css";

export default function OrderDetailList() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ field: "", direction: "asc" });
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchProductId, setSearchProductId] = useState("");

 const fetchAll = async () => {
    setLoading(true);
    const data = await OrderDetailService.getAll();
    setOrderDetails(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSort = async (field) => {
    let newDirection =
      sortConfig.field === field && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ field, direction: newDirection });

      const sortedData = [...orderDetails].sort((a, b) => {
        if (a[field] < b[field]) return newDirection === "asc" ? -1 : 1;
        if (a[field] > b[field]) return newDirection === "asc" ? 1 : -1;
        return 0;
      });
      setOrderDetails(sortedData);
    };

  // --- Search ---
    const handleSearch = async () => {
      if (!searchOrderId && !searchProductId) {
        alert("Vui lòng nhập ít nhất Mã đơn hoặc Mã sản phẩm để tìm kiếm!");
        return;
      }

      setLoading(true);
      try {
        const data = await OrderDetailService.searchOrderDetails(
          searchOrderId || null,
          searchProductId || null
        );
        setOrderDetails(data);
      } catch (error) {
        console.error("Error searching order details:", error);
      } finally {
        setLoading(false);
      }
    };

  const handleAdd = () => {
    alert("Thêm mới (chưa có form)");
  };

  const handleEdit = (id) => {
    alert(`Chỉnh sửa chi tiết đơn hàng ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chi tiết đơn hàng này?")) {
      console.log("Deleting ID:", id);
    }
  };

// --- Clear Filter ---
  const handleClearFilter = () => {
    setSearchOrderId("");
    setSearchProductId("");
    setSortConfig({ field: "", direction: "asc" });
    fetchAll(); // reload full list
  };

  return (
    <div>
      <div className="header">
        <h1>Quản lý chi tiết Đơn hàng</h1>
        <button className="back-button" onClick={() => window.history.back()}>
          <span>←</span> Trở lại
        </button>
      </div>

      <div className="content">
        {/* ===== Search Section ===== */}
        <div className="search-section">
          <div className="search-group">
            <label>
              <span className="search-icon"></span> Mã đơn
            </label>
            <input
              type="text"
              placeholder="Nhập mã đơn..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />
            <span className="clear-filter" onClick={handleClearFilter}>
                        ✖ Clear Filter
            </span>
          </div>

          <div className="search-group">
            <label>
              <span className="list-icon"></span> Mã SP
            </label>
            <input
              type="text"
              placeholder="Nhập mã sản phẩm..."
              value={searchProductId}
              onChange={(e) => setSearchProductId(e.target.value)}
            />
          </div>
        </div>

        {/* ===== Buttons ===== */}
        <div className="button-group">
          <button className="search-button" onClick={handleSearch}>
            🔍 Tìm kiếm
          </button>
          <button className="add-button" onClick={handleAdd}>
            ➕ Thêm mới
          </button>
        </div>

        {/* ===== Table ===== */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã đơn</th>
              <th
                className={`sortable ${
                  sortConfig.field === "productId" ? sortConfig.direction : ""
                }`}
                onClick={() => handleSort("productId")}
              >
                Mã SP
              </th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th
                className={`sortable ${
                  sortConfig.field === "totalPrice" ? sortConfig.direction : ""
                }`}
                onClick={() => handleSort("totalPrice")}
              >
                Thành tiền
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : orderDetails.length > 0 ? (
              orderDetails.map((detail) => (
                <tr key={detail.orderDetailId}>
                  <td>{detail.orderDetailId}</td>
                  <td>{detail.orderId}</td>
                  <td>{detail.productId}</td>
                  <td>{detail.quantity}</td>
                  <td>{detail.unitPrice}</td>
                  <td>{detail.totalPrice}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="icon-button edit-icon"
                        onClick={() => handleEdit(detail.orderDetailId)}
                        title="Sửa"
                      >
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
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ===== Pagination ===== */}
        <div className="pagination">
          <button>«</button>
          <button>‹</button>
          <button className="active">1</button>
          <button>2</button>
          <button>›</button>
          <button>»</button>
        </div>
      </div>
    </div>
  );
}

