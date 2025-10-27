import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import OrderService from "./orderService";
import OrderDetailService from "../orderDetail/orderDetailService";
import { toast } from "react-toastify";
import "../../styles/order.css";

export default function OrderForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    customerId: "",
    employeeId: "",
    orderDate:  new Date().toISOString().split("T")[0],
    discount: "",
  });

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerInput, setCustomerInput] = useState("");
  const [employeeInput, setEmployeeInput] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [custRes, empRes, prodRes] = await Promise.all([
          axiosClient.get("/customers?page=1&size=10"),
          axiosClient.get("/employees?page=0&size=10"),
          axiosClient.get("/products"),
        ]);
        setCustomers(custRes.data.data || []);
        setEmployees(empRes.data.data || []);
        const productsData = Array.isArray(prodRes.data)
          ? prodRes.data
          : (prodRes.data.data || []);
        setProducts(productsData.slice(0, 10));
      } catch (error) {
        toast.error("❌ Lỗi khi tải danh sách");
        console.error(error);
      }
    };
    fetchInitialData();
  }, []);

  // Handle initial data for edit mode
  useEffect(() => {
    if (initialData) {
      // Check if order is active (deletedType is null)
      if (initialData.deletedType !== null && initialData.deletedType !== undefined) {
        toast.error("❌ Không thể chỉnh sửa đơn hàng đã bị hủy hoặc ẩn!");
        if (onCancel) onCancel();
        return;
      }

      setFormData({
        customerId: initialData.customerId?.toString() ?? "",
        employeeId: initialData.employeeId?.toString() ?? "",
        orderDate: initialData.orderDate ?? "",
        discount: initialData.discount?.toString() ?? "",
      });

      if (initialData.customerId) {
        setCustomerInput(initialData.customerId.toString());
      }
      if (initialData.employeeId) {
        setEmployeeInput(initialData.employeeId.toString());
      }
    } else {
      setFormData({
        customerId: "",
        employeeId: "",
        orderDate:  new Date().toISOString().split("T")[0],
        discount: "",
      });
      setCustomerInput("");
      setEmployeeInput("");
    }
  }, [initialData, onCancel]);

  const handleCustomerChange = async (e) => {
    const value = e.target.value;
    setCustomerInput(value);

    const idMatch = value.match(/^\d+/);
    const inputId = idMatch ? parseInt(idMatch[0], 10) : null;

    if (inputId && !isNaN(inputId)) {
      setFormData(prev => ({ ...prev, customerId: inputId.toString() }));

      const existingCustomer = customers.find(c => c.id === inputId);
      if (!existingCustomer) {
        try {
          const res = await axiosClient.get(`/customers/${inputId}`);
          if (res?.data) {
            setCustomers(prev => {
              if (prev.find(c => c.id === res.data.id)) return prev;
              return [...prev, res.data];
            });
          }
        } catch (err) {
          console.debug("Customer not found:", inputId);
        }
      }
    } else {
      setFormData(prev => ({ ...prev, customerId: "" }));
    }
  };

  const handleEmployeeChange = async (e) => {
    const value = e.target.value;
    setEmployeeInput(value);

    const idMatch = value.match(/^\d+/);
    const inputId = idMatch ? parseInt(idMatch[0], 10) : null;

    if (inputId && !isNaN(inputId)) {
      setFormData(prev => ({ ...prev, employeeId: inputId.toString() }));

      const existingEmployee = employees.find(emp => emp.id === inputId);
      if (!existingEmployee) {
        try {
          const res = await axiosClient.get(`/employees/${inputId}`);
          if (res?.data) {
            setEmployees(prev => {
              if (prev.find(e => e.id === res.data.id)) return prev;
              return [...prev, res.data];
            });
          }
        } catch (err) {
          console.debug("Employee not found:", inputId);
        }
      }
    } else {
      setFormData(prev => ({ ...prev, employeeId: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount") {
      let discountValue = parseFloat(value);
      if (isNaN(discountValue)) discountValue = 0;

      // Clamp between 0 and 100
      if (discountValue < 0 || discountValue > 100) {
        toast.warn("⚠️ Giảm giá phải nằm trong khoảng 0% đến 100%");
      }

      if (discountValue < 0) discountValue = 0;
      if (discountValue > 100) discountValue = 100;

      setFormData((prev) => ({
        ...prev,
        discount: discountValue.toString(),
      }));

    }
    else if (name === "orderDate") {
        const today = new Date().toISOString().split("T")[0];
        if (value > today) {
          toast.warn("⚠️ Ngày mua không được lớn hơn ngày hôm nay!");
          setFormData((prev) => ({ ...prev, orderDate: today }));
        } else {
          setFormData((prev) => ({ ...prev, orderDate: value }));
        }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

// 🔹 CUSTOMER HANDLER
const handleCustomerByNameChange = async (value) => {
  setCustomerInput(value);

  // 🩵 1️⃣ Empty input → reload top 10
  if (!value || value.trim() === "") {
    try {
      const res = await axiosClient.get("/customers?page=1&size=10");
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách khách hàng:", err);
    }
    setFormData((prev) => ({ ...prev, customerId: "" }));
    return;
  }

  // 🩵 2️⃣ Try extract numeric ID
  const idMatch = value.match(/^\d+/);
  const inputId = idMatch ? parseInt(idMatch[0], 10) : null;

  try {
    // Always fetch a full list to search globally
    const res = await axiosClient.get("/customers?page=1&size=100");
    const list = res.data.data || [];

    // 🩵 3️⃣ Filter by ID or partial name match
    const filtered = list.filter((c) => {
      const idOk = inputId && c.id === inputId;
      const nameOk = c.name.toLowerCase().includes(value.toLowerCase());
      return idOk || nameOk;
    });

    // 🩵 Always show something (if nothing matches, fallback to first 10)
    setCustomers(filtered.length > 0 ? filtered.slice(0, 10) : list.slice(0, 10));

    // 🩵 4️⃣ Auto-select exact ID or name
    const exact = filtered.find(
      (c) =>
        c.id === inputId ||
        c.name.toLowerCase().trim() === value.toLowerCase().trim()
    );

    setFormData((prev) => ({
      ...prev,
      customerId: exact ? exact.id.toString() : "",
    }));
  } catch (err) {
    console.error("❌ Lỗi khi tìm khách hàng:", err);
  }
};

// 🔹 EMPLOYEE HANDLER — same logic as customer, fully stable
const handleEmployeeByNameChange = async (value) => {
  setEmployeeInput(value);

  // 🩵 1️⃣ Empty input → reload top 10
  if (!value || value.trim() === "") {
    try {
      const res = await axiosClient.get("/employees?page=0&size=10");
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách nhân viên:", err);
    }
    setFormData((prev) => ({ ...prev, employeeId: "" }));
    return;
  }

  // 🩵 2️⃣ Try extract numeric ID
  const idMatch = value.match(/^\d+/);
  const inputId = idMatch ? parseInt(idMatch[0], 10) : null;

  try {
    // Always fetch a full list to search globally — use page=0 for first page
    const res = await axiosClient.get("/employees?page=0&size=100");  // 🔴 Changed to page=0
    const list = res.data.data || [];

    // 🩵 3️⃣ Filter by ID or partial name match
    const filtered = list.filter((e) => {
      const idOk = inputId && e.id === inputId;
      const nameOk = e.name.toLowerCase().includes(value.toLowerCase());
      return idOk || nameOk;
    });

    // 🩵 Always show something (if nothing matches, fallback to first 10)
    setEmployees(filtered.length > 0 ? filtered.slice(0, 10) : list.slice(0, 10));

    // 🩵 4️⃣ Auto-select exact ID or name
    const exact = filtered.find(
      (e) =>
        e.id === inputId ||
        e.name.toLowerCase().trim() === value.toLowerCase().trim()
    );

    setFormData((prev) => ({
      ...prev,
      employeeId: exact ? exact.id.toString() : "",
    }));
  } catch (err) {
    console.error("❌ Lỗi khi tìm nhân viên:", err);
  }
};


  const handleProductChange = async (index, value) => {
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].productInput = value;

    let inputId = null;
    const formatMatch = value.match(/\((\d+)\)$/);
    if (formatMatch) {
      inputId = parseInt(formatMatch[1], 10);
    } else {
      const directMatch = value.match(/^\d+/);
      if (directMatch) {
        inputId = parseInt(directMatch[0], 10);
      }
    }

    if (inputId && !isNaN(inputId)) {
      newOrderDetails[index].productId = inputId.toString();

      const existingProduct = products.find(p => p.productId === inputId);
      if (existingProduct) {
        newOrderDetails[index].unitPrice = existingProduct.price || 0;
      } else {
        try {
          const res = await axiosClient.get(`/products/${inputId}`);
          if (res?.data) {
            setProducts(prev => {
              if (prev.find(p => p.productId === res.data.productId)) return prev;
              return [...prev, res.data];
            });
            newOrderDetails[index].unitPrice = res.data.price || 0;
          }
        } catch (err) {
          console.debug("Product not found:", inputId);
          toast.warn(`⚠️ Không tìm thấy sản phẩm với mã ${inputId}`);
        }
      }
    } else {
      newOrderDetails[index].productId = "";
      newOrderDetails[index].unitPrice = 0;
    }

    setOrderDetails(newOrderDetails);
  };

  const handleQuantityChange = (index, value) => {
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].quantity = parseInt(value) || 1;
    setOrderDetails(newOrderDetails);
  };

  const handleAddOrderDetail = () => {
    setOrderDetails([
      ...orderDetails,
      { productId: "", productInput: "", quantity: 1, unitPrice: 0 }
    ]);
  };

  const handleRemoveOrderDetail = (index) => {
    const newOrderDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(newOrderDetails);
    toast.info("🗑️ Đã xóa sản phẩm khỏi danh sách");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId || !formData.employeeId) {
      toast.error("❌ Vui lòng chọn khách hàng và nhân viên hợp lệ!");
      return;
    }

    // Double-check if editing an active order
    if (initialData?.orderId) {
      if (initialData.deletedType !== null && initialData.deletedType !== undefined) {
        toast.error("❌ Không thể cập nhật đơn hàng đã bị hủy hoặc ẩn!");
        return;
      }
    }

    const validOrderDetails = orderDetails.filter(
      detail => detail.productId && detail.quantity > 0
    );

    try {
      const orderPayload = {
        customerId: parseInt(formData.customerId, 10),
        employeeId: parseInt(formData.employeeId, 10),
        orderDate: formData.orderDate,
        discount: parseFloat(formData.discount) || 0,
      };

      let savedOrder;

      if (initialData?.orderId) {
        await OrderService.updateOrder(initialData.orderId, orderPayload);
        savedOrder = { orderId: initialData.orderId };
        toast.success("✅ Cập nhật đơn hàng thành công!");
      } else {
        savedOrder = await OrderService.createOrder(orderPayload);
        toast.success("✅ Thêm đơn hàng thành công!");

        if (validOrderDetails.length > 0) {
          for (const detail of validOrderDetails) {
            const orderDetailPayload = {
              orderId: savedOrder.orderId,
              productId: parseInt(detail.productId, 10),
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
              totalPrice: detail.quantity * detail.unitPrice,
            };
            await OrderDetailService.createOrderDetail(orderDetailPayload);
          }
          toast.success(`✅ Đã thêm ${validOrderDetails.length} sản phẩm vào đơn hàng!`);
        } else {
          toast.info("ℹ️ Đơn hàng được tạo không có sản phẩm");
        }
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi lưu đơn hàng!");
    }
  };

  const calculateTotal = () => {
    const subtotal = orderDetails.reduce(
      (sum, detail) => sum + (detail.quantity * detail.unitPrice),
      0
    );
    const discount = parseFloat(formData.discount) || 0;
    return subtotal - (subtotal * discount / 100);
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <h2>{initialData ? "✏️ Cập nhật Đơn hàng" : "➕ Thêm Đơn hàng mới"}</h2>
        <form onSubmit={handleSubmit} className="order-form">
          {/* Customer */}
          <div className="form-group">
            <label>Khách hàng *</label>
            <input
              list="customer-list"
              name="customerName"
              value={customerInput}
              onChange={(e) => handleCustomerByNameChange(e.target.value)}
              required
              autoComplete="off"
              placeholder="Nhập hoặc chọn tên khách hàng"
            />
            <datalist id="customer-list">
              {customers.map((c) => (
                <option
                  key={`customer-${c.id}`}
                  value={`${c.id} - ${c.name} (${c.phone})`}
                />
              ))}
            </datalist>
          </div>

          {/* Employee */}
          <div className="form-group">
            <label>Nhân viên *</label>
            <input
              list="employee-list"
              name="employeeName"
              value={employeeInput}
              onChange={(e) => handleEmployeeByNameChange(e.target.value)}
              required
              autoComplete="off"
              placeholder="Nhập hoặc chọn tên nhân viên"
            />
            <datalist id="employee-list">
              {employees
                .filter((e) => e && e.id !== undefined && e.id !== null)
                .map((e) => (
                  <option
                    key={`employee-${e.id}`}
                    value={`${e.id} - ${e.name} (${e.phone})`}
                  />
                ))}
            </datalist>
          </div>

          {/* Order Date */}
          <div className="form-group">
            <label>Ngày mua *</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // ✅ limit to today
              required
            />
          </div>

          {/* Discount */}
          <div className="form-group">
            <label>Giảm giá (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
              step="1"
            />
          </div>

          {/* Order Details Section */}
          {!initialData && (
            <>
              <hr />
              <h3>🛒 Chi tiết đơn hàng</h3>

              {orderDetails.length === 0 ? (
                <p className="empty-state">
                  Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.
                </p>
              ) : (
                  <div className="order-details-grid">
                {orderDetails.map((detail, index) => (
                  <div key={index} className="order-detail-item">
                    <div className="order-detail-header">
                      <h4>Sản phẩm #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveOrderDetail(index)}
                        className="remove-btn"
                      >
                        🗑️ Xóa
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Mã sản phẩm *</label>
                      <input
                        list={`product-list-${index}`}
                        value={detail.productInput}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        required
                        autoComplete="off"
                        placeholder="Nhập hoặc chọn sản phẩm"
                      />
                      <datalist id={`product-list-${index}`}>
                        {products
                          .filter((p) => p && p.productId !== undefined && p.productId !== null)
                          .map((p) => (
                            <option
                              key={`product-${p.productId}`}
                              value={`${p.name} - (${p.productId})`}
                            />
                          ))}
                      </datalist>
                    </div>

                    <div className="product-input-grid">
                      <div>
                        <label>Số lượng *</label>
                        <input
                          type="number"
                          value={detail.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label>Đơn giá</label>
                        <input
                          type="text"
                          value={detail.unitPrice.toLocaleString() + "đ"}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="item-total">
                      Thành tiền: {(detail.quantity * detail.unitPrice).toLocaleString()}đ
                    </div>
                  </div>
                ))}
            </div>
              )}

              <button
                type="button"
                onClick={handleAddOrderDetail}
                className="add-product-btn"
              >
                ➕ Thêm sản phẩm
              </button>

              {orderDetails.length > 0 && (
                <div className="order-summary">
                  <div className="order-summary-row">
                    <span>Tổng cộng:</span>
                    <span>{calculateTotal().toLocaleString()}đ</span>
                  </div>
                  {formData.discount > 0 && (
                    <div className="order-summary-note">
                      (Đã áp dụng giảm giá {formData.discount}%)
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              💾 {initialData ? "Cập nhật" : "Lưu"}
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              ❌ Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}