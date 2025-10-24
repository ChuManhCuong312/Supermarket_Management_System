import React, { useEffect, useState } from "react";
import OrderDetailService from "./orderDetailService";
import "../../styles/orderdetail.css";
import OrderDetailForm from "./OrderDetailForm";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

export default function OrderDetailList() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [originalOrderDetails, setOriginalOrderDetails] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "", direction: "asc" });

  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ orderId: "", productId: "" });
  const [originalSearchResults, setOriginalSearchResults] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);

 const fetchAll = async (pageNum = page) => {
   setLoading(true);
   try {
     let data;
     if (isSearching) {
       data = await OrderDetailService.searchOrderDetailsByPage(
         searchCriteria.orderId || null,
         searchCriteria.productId || null,
         pageNum,
         size
       );
       setOriginalSearchResults(data.content); // ✅ cache filtered results
     } else {
       data = await OrderDetailService.getOrderDetailsByPage(pageNum, size);
       setOriginalOrderDetails(data.content); // ✅ cache full list
     }

     setOrderDetails(data.content);
     setTotalPages(data.totalPages);
     setPage(data.number);
   } catch (error) {
     toast.error("❌ Lỗi khi tải danh sách chi tiết đơn hàng");
     console.error("Failed to load order details:", error);
   } finally {
     setLoading(false);
   }
 };


  useEffect(() => {
    fetchAll(page);
  }, [page, size, isSearching, searchCriteria]);


const handleSort = (field) => {
  let newDirection;

  if (sortConfig.field !== field) {
    newDirection = "asc";
  } else if (sortConfig.direction === "asc") {
    newDirection = "desc";
  } else if (sortConfig.direction === "desc") {
    newDirection = ""; // reset
  }

  setSortConfig({ field: newDirection ? field : "", direction: newDirection });

  if (!newDirection) {
    // ✅ Restore from correct cache
    if (isSearching) {
      setOrderDetails(originalSearchResults);
    } else {
      setOrderDetails(originalOrderDetails);
    }
    return;
  }

  const sortedData = [...orderDetails].sort((a, b) => {
    if (a[field] < b[field]) return newDirection === "asc" ? -1 : 1;
    if (a[field] > b[field]) return newDirection === "asc" ? 1 : -1;
    return 0;
  });

  setOrderDetails(sortedData);
};

  // --- Search ---
    const handleSearch = () => {
      if (!searchOrderId && !searchProductId) {
        toast.warn("Vui lòng nhập ít nhất Mã đơn hoặc Mã sản phẩm để tìm kiếm!");
        return;
      }

      setSearchCriteria({ orderId: searchOrderId, productId: searchProductId });
      setIsSearching(true);
      setSortConfig({ field: "", direction: "" }); // ✅ reset sort
      setPage(0);
    };


const handleAdd = () => {
    setEditingDetail(null); // ✅ clear previous edit data
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingDetail(null);
  };

  const handleFormSuccess = () => {
    fetchAll();
    setShowAddForm(false);
  };

  const handleEdit = (detail) => {
    setEditingDetail(detail); // store the clicked detail
    setShowAddForm(true);     // show the modal
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa chi tiết đơn hàng này?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await OrderDetailService.deleteOrderDetail(id);
              toast.success("Xóa chi tiết đơn hàng thành công!");
              fetchAll(); // reload list
            } catch (error) {
              toast.error("Không thể xóa chi tiết đơn hàng!");
              console.error("Error deleting order detail: ",error);
            }
          },
        },
        {
          label: "Không",
          onClick: () => toast.info("Đã hủy xóa."),
        },
      ],
    });
  };

// --- Clear Filter ---
  const handleClearFilter = () => {
    setSearchOrderId("");
    setSearchProductId("");
    setSearchCriteria({ orderId: "", productId: "" });
    setIsSearching(false);
    setSortConfig({ field: "", direction: "" }); // ✅ reset sort
    setPage(0);
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
                        onClick={() => handleEdit(detail)}
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
          <button onClick={() => setPage(0)} disabled={page === 0}>«</button>
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>‹</button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={i === page ? "active" : ""}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>›</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page + 1 >= totalPages}>»</button>

          <select
            value={size}
            onChange={(e) => {
              setSize(parseInt(e.target.value));
              setPage(0); // Reset to first page when page size changes
            }}
            style={{ marginLeft: "10px" }}
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
          </select>
        </div>

      </div>

      {/* ✅ Modal Overlay */}
            {showAddForm && (
              <div className="modal-overlay">
                  <div className="modal-content">
                    <OrderDetailForm
                      initialData={editingDetail}  // <-- prefill form if editing
                      onSuccess={handleFormSuccess}
                      onCancel={handleCloseForm}
                    />
                  </div>
                </div>
            )}
    </div>
  );
}

