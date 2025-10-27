import React, { useEffect, useState, useRef } from "react";
import productService from "./productService";
import { useNavigate } from "react-router-dom";
import "../../styles/Customer-Employee.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    barcode: "",
    category: "",
    supplier: "",
  });

  const [sortConfig, setSortConfig] = useState({
    sort: "none",
    sortBy: "name",
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "",
    price: 0,
    stock: 0,
    supplier: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    productId: null,
    message: "",
  });
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const latestQuery = useRef("");
  // ===== API calls =====
  const fetchSupplierSuggestions = async (query) => {
    try {
      const res = await fetch(`http://localhost:8080/api/suppliers/quicksearch?companyName=${query}`);
      const data = await res.json();
      setSupplierSuggestions(data);
    } catch (err) {
      console.error("Lỗi khi fetch supplier suggestions:", err);
      setSupplierSuggestions([]);
    }
  };


  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts(
        page + 1,
        itemsPerPage,
        sortConfig.sort,
        sortConfig.sortBy
      );
      setProducts(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    }
  };

  const handleSearch = async (searchFilters) => {
    const validParams = Object.fromEntries(
      Object.entries(searchFilters).filter(([_, v]) => v && v.trim() !== "")
    );

    try {
      if (Object.keys(validParams).length === 0) {
        fetchProducts();
        return;
      }

      const response = await productService.searchProducts(
        validParams,
        1,
        itemsPerPage,
        sortConfig.sort,
        sortConfig.sortBy
      );
      setProducts(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setPage(0);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.sortBy !== field) {
        return { sort: "asc", sortBy: field };
      }
      if (prev.sort === "none") return { sort: "asc", sortBy: field };
      if (prev.sort === "asc") return { sort: "desc", sortBy: field };
      return { sort: "none", sortBy: field };
    });
    setPage(0);
  };

  const renderSortIcon = (field) => {
    if (sortConfig.sortBy !== field)
      return <span className="sort-icon none" />;
    if (sortConfig.sort === "asc")
      return <span className="sort-icon asc active" />;
    if (sortConfig.sort === "desc")
      return <span className="sort-icon desc active" />;
    return <span className="sort-icon none" />;
  };

  const handleDelete = (productId) => {
    const product = products.find((p) => p.productId === productId);

    setConfirmDelete({
      isOpen: true,
      productId: productId,
      message: product
        ? `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`
        : "Bạn có chắc muốn xóa sản phẩm này không?",
    });
  };


  const confirmDeleteProduct = async () => {
    try {
      await productService.deleteProduct(confirmDelete.productId);
      setPage(0);
      fetchProducts();
      showModal("✓ Thành công", "Xóa sản phẩm thành công!", "success");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      showModal("❌ Lỗi", "Không thể xóa sản phẩm", "error");
    } finally {
      setConfirmDelete({ isOpen: false, productId: null, message: "" });
    }
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, productId: null, message: "" });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // ===== FORM =====
  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      barcode: "",
      category: "",
      price: 0,
      stock: 0,
      supplier: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.productId);
    setFormData({
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      price: product.price,
      stock: product.stock,
      supplier: product.supplier.companyName,
    });
    setSelectedSupplierId(product.supplier?.supplierId || null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        supplierId: selectedSupplierId, // gửi id nhà cung cấp
      };

      if (editingId) {
        await productService.updateProduct(editingId, payload);
        showModal("✓ Thành công", "Cập nhật sản phẩm thành công!", "success");
      } else {
        await productService.createProduct(payload);
        showModal("✓ Thành công", "Thêm mới sản phẩm thành công!", "success");
      }
      closeForm();
      fetchProducts();
    } catch (err) {
      let errorMsg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      showModal("❌ Lỗi", errorMsg, "error");
    }
  };

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
    setTimeout(() => {
      setModal({ isOpen: false, title: "", message: "", type: "info" });
    }, 2000);
  };

  const closeModal = () =>
    setModal({ isOpen: false, title: "", message: "", type: "info" });

  // ===== Effects =====
  useEffect(() => {
    fetchProducts();
  }, [page, sortConfig]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  // ===== Render =====
  return (
    <div className="page" style={{padding:"0px"}}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <span className="header-icon">📦</span>
          <h2 className="header-title">Quản lý sản phẩm</h2>
        </div>
      </div>
    <div className="content">
      {/* Filter */}
      <div className="search-section">
        <div className="search-group">
          <label>
            <span className="search-icon" /> Tên sản phẩm
          </label>
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
            <span
              className="clear-filter"
              onClick={() => {
                setFilters({ name: "", barcode: "", category: "", supplier: "" });
                handleSearch({});
              }}
              >
                ✖ Clear Filter
            </span>
        </div>

        <div className="search-group">
          <label>
            <span className="list-icon" /> Mã vạch
          </label>
          <input
            type="text"
            placeholder="Nhập mã vạch..."
            value={filters.barcode}
            onChange={(e) => handleFilterChange("barcode", e.target.value)}
          />
        </div>

        <div className="search-group">
          <label>
            <span className="list-icon" /> Loại
          </label>
          <input
            type="text"
            placeholder="Nhập loại sản phẩm..."
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          />
        </div>

        <div className="search-group">
          <label>
            <span className="list-icon" /> Nhà cung cấp
          </label>
          <input
            type="text"
            placeholder="Nhập tên nhà cung cấp..."
            value={filters.supplier}
            onChange={(e) => handleFilterChange("supplier", e.target.value)}
          />
        </div>
      </div>
        <div className="button-group">
          <button onClick={() => handleSearch(filters)} className="search-btn">
            🔍 Tìm kiếm
          </button>
          <button onClick={openAddForm} className="add-btn">
            ➕ Thêm mới
          </button>
        </div>

    </div>
      {/* Stats */}
      <div style={{ padding: "10px 20px", color: "#666", fontSize: "14px", background: "#f1f8e9" }}>
        Tổng số: <strong>{totalItems}</strong> sản phẩm
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th onClick={() => handleSort("name")} className="sortable-header">
                Tên {renderSortIcon("name")}
              </th>
              <th>Mã vạch</th>
              <th>
                Loại
              </th>
              <th onClick={() => handleSort("price")} className="sortable-header">
                Giá {renderSortIcon("price")}
              </th>
              <th onClick={() => handleSort("stock")} className="sortable-header">
                Tồn kho {renderSortIcon("stock")}
              </th>
              <th>Nhà cung cấp</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.productId}>
                  <td>{p.productId}</td>
                  <td>{p.name}</td>
                  <td>{p.barcode}</td>
                  <td>{p.category}</td>
                  <td>{p.price.toLocaleString()}₫</td>
                  <td>{p.stock}</td>
                  <td>{p.supplier?.companyName || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => openEditForm(p)} className="edit-btn">✏️</button>
                      <button onClick={() => handleDelete(p.productId)} className="delete-btn">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">Không có dữ liệu sản phẩm</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>← Trước</button>
        <span>Trang {page + 1} / {totalPages || 1}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1 || totalPages === 0}>
          Sau →
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
              <h3>{editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
              <button className="close-btn" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Tên sản phẩm <span className="required">*</span></label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Mã vạch</label>
                  <input
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ position: "relative" }}>
                  <label>Loại</label>
                  <input
                    value={formData.category}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, category: value });

                      if (value.trim() === "") {
                        setCategorySuggestions([]);
                        return;
                      }

                      latestQuery.current = value; // lưu query hiện tại
                      fetch(`http://localhost:8080/api/products/categorysearch?category=${encodeURIComponent(value)}`)
                        .then((res) => res.json())
                        .then((data) => {
                          if (latestQuery.current === value) { // chỉ set nếu query hiện tại đúng
                            setCategorySuggestions(Array.isArray(data) ? data : []);
                            console.log("Query:", value, "API response:", data);
                          }
                        })
                        .catch(() => {
                          if (latestQuery.current === value) setCategorySuggestions([]);
                        });
                    }}
                    autoComplete="off"
                  />

                  {categorySuggestions.length > 0 && (
                    <ul className="autocomplete-list">
                      {categorySuggestions.map((cat, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setFormData({ ...formData, category: cat });
                            setCategorySuggestions([]);
                          }}
                        >
                          {cat}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="form-group">
                  <label>Giá</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group" style={{ position: "relative" }}>
                  <label>Nhà cung cấp</label>
                  <input
                    value={formData.supplier}
                    onChange={(e) => {
                      setFormData({ ...formData, supplier: e.target.value });
                      setSelectedSupplierId(null); // reset khi gõ
                      if (e.target.value.trim() !== "") {
                        fetchSupplierSuggestions(e.target.value);
                      } else {
                        setSupplierSuggestions([]);
                      }
                    }}
                    onFocus={() => {
                      if (formData.supplier.trim() !== "") {
                        fetchSupplierSuggestions(formData.supplier);
                      }
                    }}
                    autoComplete="off"
                  />

                  {/* Gợi ý autocomplete */}
                  {supplierSuggestions.length > 0 && (
                    <ul className="autocomplete-list">
                      {supplierSuggestions.map((s) => (
                        <li
                          key={s.supplierId}
                          onClick={() => {
                            setFormData({ ...formData, supplier: s.companyName });
                            setSelectedSupplierId(s.supplierId);
                            setSupplierSuggestions([]);
                          }}
                        >
                          {s.companyName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="form-modal-footer">
                <button type="button" onClick={closeForm} className="btn-cancel">Hủy</button>
                <button type="submit" className="btn-save">{editingId ? "Cập nhật" : "Lưu"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={`modal-content modal-${modal.type}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              {modal.type === "success" && "✅"}
              {modal.type === "error" && "❌"}
              {modal.type === "warning" && "⚠️"}
            </div>
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-message">{modal.message}</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-ok" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete.isOpen && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content modal-warning" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Xác nhận</h3>
            <p className="modal-message">{confirmDelete.message}</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDelete}>Hủy</button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteProduct}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
